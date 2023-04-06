FROM node:18.13.0-bullseye-slim AS build
WORKDIR /app
COPY package.json package.json
RUN yarn install
COPY . /app
RUN yarn run build

FROM node:18.13.0-bullseye-slim
WORKDIR /app
COPY package.json package.json
RUN yarn install --omit=dev
COPY start.js /app/start.js
COPY --from=build /app/build /app
CMD ["node", "start.js"]