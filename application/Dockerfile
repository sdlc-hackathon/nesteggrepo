# Fetching node v20 image
FROM --platform=linux/amd64 node:21-alpine

RUN npm config set cache /home/node/.npm --global
# Setting up the work directory
WORKDIR /usr/src/app

USER node

# Installing dependencies
COPY --chown=node:node package*.json ./
RUN npm config set cache /home/node/.npm && npm install

# Copying all the files in our project
COPY --chown=node:node . .

ENV DB_USER=###DB_USER###
ENV DB_PASS=###DB_PASS###
ENV DB_NAME=###DB_NAME###
ENV DB_HOST=###DB_HOST###

# Clean up npm cache files
RUN npm cache clean --force

# Exposing server port
EXPOSE 4000

# Starting our application
CMD [ "npm", "start" ]


