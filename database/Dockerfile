FROM --platform=linux/amd64 docker.io/mariadb:11.2.3-jammy

USER mysql

COPY ./data/ /docker-entrypoint-initdb.d/

EXPOSE 3306
