# MongoDB practice

M101JS: MongoDB for Node.js Developers
Used:
 * Docker
 * MongoDB
 * NodeJs

# Run
 * First start the containers: `docker-compose up --build`
 * Attach shell to mongodb container: `docker exec -it [mongodbcontainername] /bin/bash` (change [mongodbcontainername] to your mongodb container name or containrt id `docker ps` list your running containers)
    * Recover your dumps: `mongorestore /data/dump1`,`mongorestore /data/dump2`, `mongorestore /data/dump3`
    * Leave the container: `exit`
 * Visit localhost:3302
