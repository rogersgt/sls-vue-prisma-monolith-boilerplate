# sls-vue-prisma-monolith-boilerplate
Serverless SPA monolith boilerplate with SQL automation for CI/CD. Automatically run database migrations in an ECS image against a database prior to deploying.

Built with:
* TypeScript
* Express
* Serverless
* Vue
* Prisma

Because this repo builds a Docker image for your [database migrations](https://www.prisma.io/docs/orm/prisma-migrate), you need to have Docker engine running.

## development
* Copy the `example.env` to a new file called `.env`
* `docker compose up -d`
* `npm i`
* `npm start`

## deploy
Currently supports AWS.

### Prerequisites
* Create AWS Certificate that covers `*.${HOSTED_ZONE_NAME}` (defined in your `.env`) and add it as the value for `AWS_ACM_CERTIFICATE_ARN`.
* Create a `DATBASE_URL` secret SSM Parameter under `/app/prod/${APP_NAME}/DATABASE_URL`.
* Ensure the app user has correct permissions in hosed database instance.

### Deploy Steps
* `npm i`
* `npm run deploy`
