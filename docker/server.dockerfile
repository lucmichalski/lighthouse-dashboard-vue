FROM node:12-alpine

RUN mkdir -p /app/

WORKDIR /app/

COPY package.json package-lock.json /app/

COPY ./ /app/

RUN npm i

ENV NODE_ENV=production

RUN npm run build

CMD [ "npm", "run", "start" ]
