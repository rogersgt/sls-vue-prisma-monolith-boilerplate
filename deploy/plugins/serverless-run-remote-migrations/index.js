'use strict';
const serverless = require('serverless'); // eslint-disable-line no-unused-vars
const childProcess = require('child_process');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const {
  ECRClient,
  DescribeRepositoriesCommand,
  CreateRepositoryCommand,
  GetAuthorizationTokenCommand,
} = require('@aws-sdk/client-ecr');
const {
  CloudFormationClient,
  DescribeStacksCommand,
  CreateStackCommand,
  UpdateStackCommand,
} = require('@aws-sdk/client-cloudformation');
const { ECSClient, RunTaskCommand, DescribeTasksCommand } = require('@aws-sdk/client-ecs');
const { readFileSync } = require('fs');
const { normalize, join } = require('path');
const Dockerode = require('dockerode');

class ServerlessRunRemoteMigrations {
  /**
   *
   * @param {serverless} serverless Serverless Instance
   * @param {object} cliOptions serverless CLI options
   * @param {object} serverlessUtils serverless utility tools like log
   */
  constructor(serverless, _cliOptions, { log, writeText }) {
    this.serverless = serverless;
    this.name = 'serverless-run-remote-migrations';
    this.log = log;
    this.writeText = writeText;
    const { region = 'us-east-1', docker = {} } = this.getConfig();
    this.region = region;
    this.docker = new Dockerode({ ...docker });

    this.hooks = {
      // 'package:finalize': this.buildImage.bind(this),
      'before:deploy:deploy': this.runRemoteMigrations.bind(this),
    };
  }

  getTaskStackName() {
    const appName = this.serverless.service.service;
    const stage = this.serverless.service.provider.region;
    return `${appName}-${stage}-migrations`;
  }

  async ecrLogin() {
    const client = new ECRClient();
    const cmd = new GetAuthorizationTokenCommand();
    const resp = await client.send(cmd);
    return resp;
  }

  async upsertCloudformationStack(templatePath, parameters, stackName) {
    const client = new CloudFormationClient();

    try {
      const cmd = new CreateStackCommand({
        StackName: stackName,
        TemplateBody: readFileSync(templatePath),
        Parameters: parameters,
      });
      await client.send(cmd);
    } catch (error) {
      if (!error.Error || !error.Error.Code || error.Error.Code !== 'AlreadyExistsException') {
        throw error;
      }
      const cmd = new UpdateStackCommand({
        StackName: stackName,
        TemplateBody: readFileSync(templatePath),
        Parameters: parameters,
      });
      try {
        await client.send(cmd);
      } catch (error) {
        // console.log(JSON.stringify(error));
        if (!error.message || error.message !== 'No updates are to be performed.') {
          throw error;
        }
      }
    }

    await this.waitForStack(stackName);
  }

  async waitForStack(stackName) {
    const resp = await this.getStack(stackName);
    const { Stacks = [] } = resp;
    const stack = Stacks.pop();
    if (stack) {
      const { StackStatus } = stack;
      if (StackStatus.includes('FAILED') || StackStatus.includes('ROLLBACK')) {
        throw new Error(`stack ${stackName} entered state ${StackStatus}`);
      }
      if (StackStatus.includes('IN_PROGRESS')) {
        this.writeText(`${stackName}: ${StackStatus}`);
        await new Promise((res) => setTimeout(res, 5000));
        return this.waitForStack(stackName);
      }

      return true;
    }
  }

  async getStack(stackName) {
    const client = new CloudFormationClient();
    const cmd = new DescribeStacksCommand({
      StackName: stackName,
    });
    return client.send(cmd);
  }

  getRepoName() {
    const appName = this.serverless.service.service;
    return `${appName}-migrations`;
  }

  exec(cmd) {
    const buff = childProcess.exec(cmd)
    
    return new Promise((res, rej) => {
      buff.on('message', (msg) => {
        this.writeText(msg);
      });
      buff.on('close', (code) => {
        if (code !== 0) {
          rej(`${cmd} failed with exit code ${code}`);
        } else {
          res();
        }
      });
      buff.on('error', console.error);
    })
  }

  async pushImage(username, password) {
    const image = await this.getFullImageUri();
    this.log.verbose(`pushing docker image ${image}`);
    const builtImage = await this.docker.getImage(image);
    
    const stream = await builtImage.push({
      authconfig: {
        username,
        password,
      },
    });
    const pushResp = await new Promise((resolve, reject) => {
      this.docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
    });
    return pushResp;
  }

  async getAccountId() {
    const stsClient = new STSClient();
    const cmd = new GetCallerIdentityCommand();
    const { Account } = await stsClient.send(cmd);
    return String(Account);
  }

  async getRepoUri() {
    const { aws = {} } = this.getConfig();

    let uriName = this.getRepoName();
    if (aws) {
      const accountId = await this.getAccountId();
      uriName = `${accountId}.dkr.ecr.${this.region}.amazonaws.com/${uriName}`;
    }
    return uriName;
  }

  async upsertECRRepo() {
    const ecrCient = new ECRClient();
    
    const repoName = this.getRepoName();
    try {
      const cmd = new DescribeRepositoriesCommand({
        repositoryNames: [repoName],
      });
      await ecrCient.send(cmd);
    } catch (error) {
      const cmd = new CreateRepositoryCommand({
        repositoryName: repoName,
      });
      await ecrCient.send(cmd);
    }
  }

  async getFullImageUri() {
    if (!this.image) {
      const repoUri = await this.getRepoUri();
      const { tag = 'latest' } = this.getConfig() || {};
      this.image = `${repoUri}:${tag}`;
    }
    return this.image;
  }

  async buildImage() {
    this.log('Building sls migrations docker image');
    const { build = {} } = this.getConfig();
    const { dockerfile, context = '.' } = build;
    if (!dockerfile) throw new Error(`Provide a build.dockerfile to excute for build docker image`);
    this.log.verbose(`building using ${dockerfile}`);
    await this.writeText('building db migrations image');
    const image = await this.getFullImageUri();
    const dockerBuild = `docker build -t ${image} -f ${dockerfile} ${context}`;
    const buff = childProcess.exec(dockerBuild);
    await new Promise((res, rej) => {
      buff.on('message', (message) => {
        this.writeText(message.toString());
      });
      buff.on('close', (code) => {
        if (code !== 0) {
          rej(`Migrations build exited with error code: ${code}`);
        } else {
          res();
        }
      })
    });
    // const fullContext = path.normalize(path.join(process.cwd(), context));
    // const stream = await this.docker.buildImage({
    //   context: fullContext,
    //   src: [dockerfile],
    // }, {
    //   t: image,
    // });
    // await new Promise((resolve, reject) => {
    //   this.docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
    // });
  }

  getConfig() {
    return this.serverless.service.custom[this.name] || {};
  }

  async runRemoteMigrations() {
    const { deploy = {} } = this.getConfig();

    await this.buildImage();
    await this.writeText('running database migrations');

    if (deploy.aws) {
      await this.upsertECRRepo();
      const { authorizationData } = await this.ecrLogin();
      const { authorizationToken  } = authorizationData.find((auth) => auth.authorizationToken) || {};
      const [username, password] = Buffer.from(authorizationToken, 'base64').toString().split(':');
      await this.pushImage(username, password);

      const taskStackName = this.getTaskStackName();
      const parameters = [{
        ParameterKey: 'RepoName',
        ParameterValue: this.getRepoName(),
      }, {
        ParameterKey: 'Image',
        ParameterValue: await this.getFullImageUri(),
      }, {
        ParameterKey: 'Cpu',
        ParameterValue: deploy.cpu || 256,
      }, {
        ParameterKey: 'Memory',
        ParameterValue: deploy.memory || 512,
      }
    ];

      await this.upsertCloudformationStack(normalize(join(__dirname, 'cloudformation.yml')), parameters, taskStackName);
    }
  }
}

module.exports = ServerlessRunRemoteMigrations;
