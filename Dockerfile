FROM node:8-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i -D

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "apollo" ]
