#################################################################

# Stage 1 : Build Node.js application

FROM node:16.13.2-alpine3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74 as builder

LABEL maintainer="Glenn Parreno <gparreno@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

#################################################################

# STAGE 2 : Create lightweight image

FROM node:16.13.2-alpine3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74

COPY --from=builder /app /app

WORKDIR /app

EXPOSE 8080

CMD npm start

#HEALTHCHECK --interval=3m \
#      CMD curl --fail http://localhost:8080/ || exit 1
