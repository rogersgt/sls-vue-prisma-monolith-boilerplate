'use strict';
const serverless = require('serverless'); // eslint-disable-line no-unused-vars
const childProcess = require('child_process');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const {
  ECRClient,
  DescribeRepositoriesCommand,
  CreateRepositoryCommand,
  GetAuthorizationTokenCommand,
  DeleteRepositoryCommand,
} = require('@aws-sdk/client-ecr');
const {
  CloudFormationClient,
  DescribeStacksCommand,
  CreateStackCommand,
  UpdateStackCommand,
  DeleteStackCommand,
} = require('@aws-sdk/client-cloudformation');
const { ECSClient, RunTaskCommand, DescribeTasksCommand } = require('@aws-sdk/client-ecs');
const { readFileSync } = require('fs');
const { normalize, join } = require('path');
const Dockerode = require('dockerode');
const { EC2Client, DescribeVpcsCommand, DescribeSubnetsCommand, DescribeSecurityGroupsCommand } = require('@aws-sdk/client-ec2');

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
    const { region = 'us-east-1', docker = {}, deploy = {} } = this.getConfig();
    this.region = region;
    this.docker = new Dockerode({ ...docker });

    this.awsCreds = {
      region,
    };

    this.lastTaskStatus = '';
    this.lastStackStatus = '';

    if (deploy.aws) {
      this.ecsClient = new ECSClient(this.awsCreds);
      this.cloudformationClient = new CloudFormationClient(this.awsCreds);
      this.ecrClient = new ECRClient(this.awsCreds);
      this.ec2Client = new EC2Client(this.awsCreds);
    }
    this.commands = {
      runRemoteMigrations: {
        lifecycleEvents: ['run']
      },
    };
    this.hooks = {
      'package:finalize': this.buildImage.bind(this),
      'remove:remove': this.remove.bind(this),
      'runRemoteMigrations:run': this.runRemoteMigrations.bind(this),
    };
  }

  getTaskStackName() {
    const { deploy = {} } = this.getConfig();
    const { stackName } = deploy.aws ?? {};
    if (stackName) return `${stackName}`;
    const appName = this.serverless.service.service;
    const stage = this.serverless.service.provider.stage;
    return `${appName}-${stage}-migrations`;
  }

  async ecrLogin() {
    const client = this.ecrClient || new ECRClient(this.awsCreds);
    const cmd = new GetAuthorizationTokenCommand();
    const resp = await client.send(cmd);
    return resp;
  }

  async remove() {
    const { deploy = {} } = this.getConfig();
    if (deploy.aws) {
      const stackName = this.getTaskStackName();
      await this.cloudformationClient.send(new DeleteStackCommand({
        StackName: stackName,
      }));
     await this.ecrClient.send(new DeleteRepositoryCommand({
      repositoryName: this.getRepoName(),
     }));
    }
  }

  async upsertCloudformationStack(templatePath, parameters, stackName) {
    const client = this.cloudformationClient || new CloudFormationClient(this.awsCreds);

    try {
      const cmd = new CreateStackCommand({
        StackName: stackName,
        TemplateBody: readFileSync(templatePath),
        Parameters: parameters,
        Capabilities: ['CAPABILITY_IAM']
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
        Capabilities: ['CAPABILITY_IAM']
      });
      try {
        await client.send(cmd);
      } catch (error) {
        if (!error.message || error.message !== 'No updates are to be performed.') {
          throw error;
        }
      }
    }

    await this.waitForStack(stackName);
    return this.getStack(stackName);
  }

  async waitForStack(stackName) {
    const stack = await this.getStack(stackName);

    if (stack) {
      const { StackStatus } = stack;
      if (StackStatus.includes('FAILED') || StackStatus.includes('ROLLBACK')) {
        throw new Error(`stack ${stackName} entered state ${StackStatus}`);
      }

      if (StackStatus.includes('IN_PROGRESS')) {
        if (StackStatus !== this.lastStackStatus) {
          this.writeText(`${stackName}: ${StackStatus}`);
        }
        this.lastTaskStatus = StackStatus;
        await new Promise((res) => setTimeout(res, 5000));
        return this.waitForStack(stackName);
      }

      this.lastStackStatus = '';
      return stack;
    } else {
      throw new Error(`${stackName} not found`);
    }
  }

  async getStack(stackName) {
    const client = this.cloudformationClient || new CloudFormationClient(this.awsCreds);
    const cmd = new DescribeStacksCommand({
      StackName: stackName,
    });
    const { Stacks: stacks = [] } = await client.send(cmd);
    if (!stacks.length) {
      throw new Error(`Stack: ${stackName} not found`);
    }
    return stacks[0];
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
    this.log(`pushing docker image ${image}`);
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
    const stsClient = new STSClient(this.awsCreds);
    const cmd = new GetCallerIdentityCommand();
    const { Account } = await stsClient.send(cmd);
    return String(Account);
  }

  async getRepoUri() {
    const { deploy = {} } = this.getConfig();

    let uriName = this.getRepoName();
    if (deploy.aws) {
      const accountId = await this.getAccountId();
      uriName = `${accountId}.dkr.ecr.${this.region}.amazonaws.com/${uriName}`;
    }
    return uriName;
  }

  async upsertECRRepo() {
    const ecrCient = this.ecrClient || new ECRClient(this.awsCreds);
    
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
      const { build = {} } = this.getConfig() || {};
      const { tag = 'latest' } = build;
      this.image = `${repoUri}:${tag}`;
    }
    return this.image;
  }

  async buildImage() {
    this.log('Building sls migrations docker image');
    const { build = {} } = this.getConfig();
    const { dockerfile, context = '.' } = build;
    if (!dockerfile) throw new Error(`Provide a build.dockerfile to excute for build docker image`);
    this.log(`building using ${dockerfile}`);
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
        },
        {
          ParameterKey: 'Command',
          ParameterValue: deploy.command,
        }
      ];
      if (deploy.secret && deploy.secret.fromValue) {
        parameters.push({
          ParameterKey: 'SecretArn',
          ParameterValue: deploy.secret.fromValue,
        });
        parameters.push({
          ParameterKey: 'SecretName',
          ParameterValue: deploy.secret.name || 'DATABASE_URL',
        })
      }
      // run task
      const taskStack = await this.upsertCloudformationStack(normalize(join(__dirname, 'cloudformation.yml')), parameters, taskStackName);

      // const ec2Client = new EC2Client(this.awsCreds);
      const ecsClient = this.ecsClient || new ECSClient(this.awsCreds);

      const awsConfig = typeof deploy.aws === 'boolean' ? {} : deploy.aws;
      const { vpc = {} } = awsConfig;
      let {
        securityGroupId,
        subnetId,
        autoAssignPublicIp = 'ENABLED',
      } = vpc;

      if (!securityGroupId || !subnetId) {
        const { Vpcs: vpcs } = await this.ec2Client.send(new DescribeVpcsCommand({}));
        const defaultVpc = vpcs.find((vpc) => vpc.IsDefault);
        if (!defaultVpc) {
          throw new Error(`Default VPC not found!`);
        }

        const { Subnets: subnets = [] } = await this.ec2Client.send(new DescribeSubnetsCommand({
          Filters: [{
            Name: 'vpc-id',
            Values: [defaultVpc.VpcId]
          }]
        }));

        if (!subnets.length && !subnetId) {
          throw new Error(`No subnets found for vpc: ${defaultVpc.VpcId}`)
        }

        const { SecurityGroups: secGroups = [] } = await this.ec2Client.send(new DescribeSecurityGroupsCommand({
          Filters: [{
            Name: 'vpc-id',
            Values: [defaultVpc.VpcId]
          }]
        }));

        if (!secGroups.length && !securityGroupId) {
          throw new Error(`No security groups found for vpc ${defaultVpc.VpcId}`)
        }

        subnetId = subnetId || subnets[0].SubnetId;
        securityGroupId = securityGroupId || secGroups[0].GroupId;
      }

      this.log(`Using subnetId=${subnetId} and securityGroupId=${securityGroupId}`);

      const taskArn = taskStack.Outputs.find((o) => o.OutputKey === 'TaskArn').OutputValue;
      const clusterName = taskStack.Outputs.find((o) => o.OutputKey === 'ClusterName').OutputValue;
      const runTaskCmd = new RunTaskCommand({
        taskDefinition: taskArn,
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: autoAssignPublicIp,
            subnets: [subnetId],
            securityGroups: [securityGroupId],
          },
        },
        launchType: 'FARGATE',
        cluster: clusterName,
      });

      const runTaskResp = await ecsClient.send(runTaskCmd);

      this.waitForTask(runTaskResp.tasks[0].taskArn || '', clusterName);
    }
  }

  /**
   * 
   * @param {string} taskArn 
   */
  async waitForTask(taskArn, cluster) {
    const cmd = new DescribeTasksCommand({
      tasks: [taskArn],
      cluster,
    });

    const { tasks = [] } = await this.ecsClient.send(cmd);

    if (!tasks.length) {
      throw new Error(`Task ${taskArn} not found`);
    }

    const task = tasks[0];
    const { stopCode, lastStatus, startedAt, stoppedAt, stoppedReason, containers } = task;
    if (stopCode === 'TaskFailedToStart' || stopCode === 'UserInitiated' || stopCode === 'TerminationNotice' || stopCode === 'SpotInterruption' || stopCode === 'ServiceSchedulerInitiated') {
      throw new Error(`db migrations task status stopCode: ${stopCode}`);
    }

    if (startedAt) {
      this.log(`db migrations task started at ${startedAt}`);
    }

    if (this.lastTaskStatus !== lastStatus) {
      this.lastTaskStatus = lastStatus;
      this.log(`db migrations task: ${lastStatus}`);
    }

    const migrationContainer = containers[0];
    if (typeof migrationContainer.exitCode === 'undefined') {
      await new Promise((res) => setTimeout(res, 5000));
      return this.waitForTask(taskArn, cluster);
    }

    this.lastTaskStatus = '';

    if (migrationContainer.exitCode !== 0) {
      throw new Error(`Db migrations task exited at ${stoppedAt} with error code: ${migrationContainer.exitCode}: ${stoppedReason}: ${stopCode}`);
    }

    return task;
  }
}

module.exports = ServerlessRunRemoteMigrations;
