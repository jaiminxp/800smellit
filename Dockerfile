FROM node:21.4.0
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD [ "npx", "nx", "serve", "api" ]