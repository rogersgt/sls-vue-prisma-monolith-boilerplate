'use strict';
const serverless = require('serverless'); // eslint-disable-line no-unused-vars
const childProcess = require('child_process');

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

  async buildImage(push = false) {
    await this.writeText('building db migrations image')
  }

  getConfig() {
    return this.serverless.service.custom[this.name] || {};
  }
}

module.exports = ServerlessRunRemoteMigrations;
