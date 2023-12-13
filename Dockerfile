FROM node:21.4.0
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD [ "npx", "nx", "serve", "api" ]