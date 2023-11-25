FROM node:16.14.0-alpine AS development

WORKDIR /app

RUN apk add yarn

COPY ./package.json ./yarn.lock /app/

RUN yarn install

COPY ./tsconfig*.json ./tsconfig-paths.js  /app/
COPY ./src /app/src

RUN yarn build
COPY ./src/locales /app/dist/src/locales/

FROM node:16.14.0-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=development /app/package.json /app/tsconfig*.json /app/tsconfig-paths.js /app/
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist

EXPOSE 8080

ENTRYPOINT ["yarn", "start"]
