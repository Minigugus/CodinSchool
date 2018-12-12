FROM node:8-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -D && NODE_ENV=production npm run build

CMD [ "npm", "run", "serve:production" ]
