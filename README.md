# road-dog-app
Band tour scheduling

## development
* `docker compose up -d`
* `npm i`
* `npm start`
From another terminal window run:
```bash
cd road-dog-frontend
npm i
npm start
```

## deploy
### Prerequisites
* Create AWS Certificate that covers `*.${HOSTED_ZONE_NAME}` (defined in your `.env`) and add it as the value for `AWS_ACM_CERTIFICATE_ARN`.
* Create a `DATBASE_URL` secret SSM Parameter under `/app/prod/${APP_NAME}/DATABASE_URL`.
* Ensure the app user has correct permissions in hosed database instance.

### Deploy Steps
* `npm i`
* `npm run deploy`
