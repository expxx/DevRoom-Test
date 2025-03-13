FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN npm install
RUN npm install -g typescript ts-node
RUN npx tsc

CMD ["node", "dist/app.js"]