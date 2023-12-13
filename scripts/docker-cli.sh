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