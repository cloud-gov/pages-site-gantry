# Use a base Node.js image
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev"]

