FROM node:latest as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./src ./src
RUN npm run build

WORKDIR '/app/client'
COPY ./client/package.json .
RUN npm install
COPY ./client/public ./public
COPY ./client/src ./src
RUN npm run build

FROM node:alpine
WORKDIR '/app'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/build ./client/build
COPY ./config ./config

ENV NODE_ENV production
EXPOSE 4000

CMD ["node", "dist/main"]