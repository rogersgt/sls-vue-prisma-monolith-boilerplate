# sls-vue-ssr-prisma-boilerplate
This is a boilerplate with Vue SSR, serverless, typescript, and prisma with PostgreSQL. There are 2 stages:
`dev` (local development) and `prod` (deployed instance).

* Clone this repo
* rename all instances of `sls-vue-ssr-prisma-boilerplate`
* Copy the `example.env` to a new file called `.env` and fill in all values

## development
* `docker compose up -d`
* `npm i`
* `npm start`

## deploy
### Prerequisites
* Create AWS Certificate that covers `*.${HOSTED_ZONE_NAME}` (defined in your `.env`)
* Create a `DATBASE_URL` secret SSM Parameter under `/app/prod/${APP_NAME}/DATABASE_URL`
* Ensure the app user has correct permissions in hosed database instance

### Deploy Steps
* `npm i`
* `npm run deploy`
