#Dockerfile. This defines a set of instructions used by the docker engine to define a docker image. This Docker imager can be
#used to make a running docker container.

#Still trying to get to know on how to use this.

#Every docker file begins with a FROM instruction.
FROM node:16.13.2


#LABEL instructions add key value pairs about arbitrary metadata about this image
LABEL maintainer="Glenn Parreno <gparreno@myseneca.ca>"
LABEL description="Fragments node.js microservice"

#Default to use port 8080 in our service
ENV PORT=8080

#Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

#Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

#Use /app as our working directory
WORKDIR /app

#Copy dependencies into docker. To do this we use the COPY instruction. 
COPY package*.json /app/

#Install the dependencies defined in package.json and package-lock.json. The RUN instruction is used for this.
RUN npm install

#Copy the server's code into the image.
COPY ./src ./src

#Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

#Start the container by running our server
CMD npm start

#The EXPOSE instruction is used to indicate the port(s) that a container will listen to when run.
#We run our service on port 8080
EXPOSE 8080
