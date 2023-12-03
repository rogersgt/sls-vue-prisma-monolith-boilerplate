'use strict';
const serverless = require('serverless'); // eslint-disable-line no-unused-vars
const childProcess = require('child_process');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const { ECRClient, DescribeRepositoriesCommand, CreateRepositoryCommand } = require('@aws-sdk/client-ecr');

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
    const { region = 'us-east-1' } = this.getConfig();
    this.region = region;

    this.hooks = {
      'package:finalize': this.buildImage.bind(this),
      'before:deploy:deploy': this.runRemoteMigrations.bind(this),
    };
  }

  async runRemoteMigrations() {
    await this.buildImage(true);
    await this.writeText('running database migrations');
  }

  async getRepoUri() {
    const { aws = {} } = this.getConfig();
    const appName = this.serverless.service.service;
    
    let uriName = `${appName}-migrations`;
    if (aws) {
      const stsClient = new STSClient();
      const cmd = new GetCallerIdentityCommand();
      const { Account } = await stsClient.send(cmd);
      uriName = `${Account}.dkr.ecr.${this.region}.amazonaws.com/${appName}`;
    }
    return uriName;
  }

  async upsertECrRepo() {
    const ecrCient = new ECRClient();
    const appName = this.serverless.service.service;
    
    const repoName = `${appName}-migrations`;
    try {
      const cmd = new DescribeRepositoriesCommand({
        repositoryNames: [repoName],
      });
      await ecrCient.send(cmd);
    } catch (error) {
      const cmd = new CreateRepositoryCommand({
        repositoryName: repoName,
      });
      const resp = await ecrCient.send(cmd);
      this.log(resp);
    }
  }

  async buildImage(push = false) {
    const { build = {} } = this.getConfig();
    const { dockerfile, context = '.' } = build;
    if (!dockerfile) throw new Error(`Provide a build.dockerfile to excute for build docker image`);
    await this.writeText('building db migrations image');
    const repoUri = await this.getRepoUri();
    const now = new Date();
    const tag = now.valueOf();
    const dockerBuild = `docker build -t ${repoUri}:${tag} -f ${dockerfile} ${context}`;
    this.log(dockerBuild)
    const buff = childProcess.exec(dockerBuild);
    await new Promise((res, rej) => {
      buff.on('message', (message) => {
        console.log(message);
        this.writeText(message.toString());
      });
      buff.on('close', (code) => {
        if (code !== 0) {
          rej(`Migrations build exited with error code: ${code}`);
        } else {
          res();
        }
      })
    })
  }

  getConfig() {
    return this.serverless.service.custom[this.name] || {};
  }
}

module.exports = ServerlessRunRemoteMigrations;
