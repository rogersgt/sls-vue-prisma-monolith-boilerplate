import * as winston from 'winston';

/**
 * Winston docs https://github.com/winstonjs/winston
 */

const { LOG_LEVEL = 'info', IS_OFFLINE, APP_NAME = 'app' } = process.env;

const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: {
    service: APP_NAME,
  },
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    ...(!IS_OFFLINE ? [winston.format.json()] : [winston.format.prettyPrint()])
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
