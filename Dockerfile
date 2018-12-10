FROM node:8-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -D && \
	npm run build

EXPOSE 4000

CMD [ "npm", "run", "apollo:run" ]
