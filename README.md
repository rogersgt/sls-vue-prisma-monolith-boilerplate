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
* `npm i`
* `npm run deploy`
