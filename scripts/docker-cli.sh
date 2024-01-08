# build the image
docker build -t 800smellit-image .

# run the container
docker run -p 3000:3000 -d --name 800smellit 800smellit-image

# run the container with bindmount volume
docker run -v $(pwd)/apps:/app/apps -p 3000:3000 -d --name 800smellit 800smellit-image

# run the container with anonymous volume for node_modules
docker run -v $(pwd)/apps:/app/apps -v /app/node_modules -p 3000:3000 -d --name 800smellit 800smellit-image

# run the container with readonly bindmount volume (:ro flag)
docker run -v $(pwd)/apps:/app/apps:ro -v /app/node_modules -p 3000:3000 -d --name 800smellit 800smellit-image

# run the container and set env variable in it
docker run -v $(pwd)/apps:/app/apps:ro -v /app/node_modules --env PORT=4000 -p 3000:4000 -d --name 800smellit 800smellit-image

# run the container and specify .env file to use
docker run -v $(pwd)/apps:/app/apps:ro -v /app/node_modules --env-file apps/api/.env -p 3000:3000 -d --name 800smellit 800smellit-image

# kill and remove the container (forced)
docker rm 800smellit -f

# delete anonymous volumes when removing the container
docker rm 800smellit -fv

# access container cli
docker exec -it 800smellit bash

# display container logs
docker logs 800smellit

# start the containers in detached mode
docker compose up -d

# rebuild the image and start the containers
docker compose up -d --build

# stop containers and delete the anonymous volumes
docker compose down -v

# use different compose files for different environments
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v # -v flag also deletes named volumes

# specify the name of the service to start (api) and don't start linked services (--no-deps)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d api --no-deps

# if the containers are already up and running
# build the image and renew anonymous volumes (-V or --renew-anon-volumes)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V

# run mongo shell in mongo container
docker exec -it 800smellit-mongo mongosh -u "jaimin" -p "800smellit"

# get info about a container
docker inspect 800smellit-api

# list networks
docker network ls

# get network details
docker network inspect 800smellit-nx_default