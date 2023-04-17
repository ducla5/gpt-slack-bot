FROM node:16-alpine

WORKDIR /app

ADD package* .

RUN npm install

ADD . .

CMD [ "node", "app.js" ]