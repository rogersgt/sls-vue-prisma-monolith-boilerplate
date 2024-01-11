import {
  SSMClient,
  GetParameterCommand,
  GetParametersCommand,
} from '@aws-sdk/client-ssm';

import logger from '../logger';

const { APP_NAME = 'scheduler-api', ENVIRONMENT = 'dev', AWS_REGION = 'us-east-1' } = process.env;
const DEFAULT_PARAM_PATH = `/app/${ENVIRONMENT}/${APP_NAME}`;

export class Config {
  private paramPath: string;
  private ssmClient: SSMClient;

  constructor(ssmParameterPath?: string) {
    this.paramPath = ssmParameterPath ?? DEFAULT_PARAM_PATH;
    this.ssmClient = new SSMClient({
      region: AWS_REGION
    });
  }

  /**
   *
   * @param key variable name with the ssm parameter path prefix removed 
   * (i.e. "/app/dev/scheduler-api/VAR", would be referenced as "VAR")
   * Returns the decrypted value; or returns any process.env.VAR value if it exists.
   */
  async get(key: string) {
    const envValue = process.env[key];
    if (!envValue) {
      const cmd = new GetParameterCommand({
        Name: `${this.paramPath}/${key}`,
        WithDecryption: true,
      });
      logger.debug(`Fetching ${key} from SSM API`);
      const { Parameter: param } = await this.ssmClient.send(cmd);
      process.env[key] = param?.Value ?? undefined;
    }
    return process.env[key];
  }

  async getMany<T extends string>(keys: T[]): Promise<Record<T, string>> {
    // check which keys are already in process.env
    const keysToGet = keys.filter((key) => {
      return !process.env[key] || process.env[key] === 'undefined';
    });
    if (keysToGet.length) {
      const cmd = new GetParametersCommand({
        Names: keysToGet.map((key) => `${this.paramPath}/${key}`),
        WithDecryption: true,
      });
      logger.debug(`Fetching ${keysToGet.length} Parameters from SSM API`);
      const { Parameters: params } = await this.ssmClient.send(cmd);
      const PREFIX = `${this.paramPath}/`;
      params?.forEach((param) => {
        process.env[param?.Name?.split(PREFIX)[1] ?? ''] =
          param?.Value ?? undefined;
      });
    }
    return keys.reduce(
      (acc, key) => ({ ...acc, [key]: process.env[key] }),
      {} as Record<T, string>
    );
  }
}
const appConfig = new Config();
export default appConfig;
