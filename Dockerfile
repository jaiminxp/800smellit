FROM node:21.4.0
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD [ "npx", "nx", "serve", "api" ]