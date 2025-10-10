    # Use a base Node.js image
    FROM node:22 AS build

    WORKDIR /app

    COPY package*.json ./

    RUN npm ci

    COPY .  .

    EXPOSE 4321

