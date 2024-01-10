FROM --platform=linux/amd64 node:latest

RUN mkdir /app
WORKDIR /app

ADD src /app/src
ADD prisma /app/prisma
ADD package.json package-lock.json tsconfig.json .eslintrc /app/
RUN npm i --ignore-scripts

CMD [ "npm", "run", "db:migrate:deploy" ]
