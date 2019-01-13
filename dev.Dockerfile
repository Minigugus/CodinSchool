FROM node:10-alpine AS codinschool_node

RUN apk add --update g++ gcc make python bash

FROM codinschool_node

COPY lancer.sh /docker-lancer.sh

VOLUME /app

ENTRYPOINT [ "/docker-lancer.sh", "sh", "-c" ]
CMD [ "npm run apollo" ]
