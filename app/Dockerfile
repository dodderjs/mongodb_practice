 # Use node
FROM node:10.1.0

# Set WWW enviroment variable
ENV WWW=/usr/src/app

# Create a directory where our app will be placed
RUN mkdir -p $WWW

# Change directory so that our commands run inside this new directory
ADD . $WWW
WORKDIR $WWW

# Install dependecies
RUN npm install

#Set end export default enviroment variable to the port
ENV NODE_ENV_PORT=3302
EXPOSE $NODE_ENV_PORT

# Serve the app
CMD ["npm", "start"]