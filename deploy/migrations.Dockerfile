FROM node:latest

RUN mkdir /app
# create this bin dir just for postinstall
RUN mkdir -p /app/deploy/bin
WORKDIR /app

ADD src /app/src
ADD prisma /app/prisma
ADD package.json package-lock.json tsconfig.json .eslintrc /app/
RUN npm i

CMD [ "npm", "run", "db:migrate:deploy" ]
