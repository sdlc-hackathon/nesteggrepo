FROM --platform=linux/amd64 docker.io/node:20-alpine AS build

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn --registry https://registry.npmjs.org

RUN yarn install

COPY . .

RUN echo ###API_URL### > .env

RUN yarn build

FROM --platform=linux/amd64 docker.io/nginxinc/nginx-unprivileged

USER root

ARG DOCROOT=/usr/share/nginx/html

COPY --chown=root:root --from=build /app/build ${DOCROOT}

RUN chown -R root:root ${DOCROOT} && chmod -R 755 ${DOCROOT}

USER nginx

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
