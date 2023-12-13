# build the image
docker build -t 800smellit-image .

# run the container
docker run -p 3000:3000 -d --name 800smellit 800smellit-image

# kill and remove the container (forced)
docker rm 800smellit -f

# access container cli
docker exec -it 800smellit bash