FROM node:alpine

MAINTAINER Vitor Silva Lima <vitor.lima2@fatec.sp.gov.br>

RUN apk add --no-cache --update tzdata git
ENV TZ=America/Sao_Paulo
RUN rm -rf /var/cache/apk/*

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN rm -rf .git
RUN git init

ENV NODE_ENV="production"
ENV DB_USERNAME=""
ENV DB_PASSWORD=""
ENV DB_URL="mongodb://172.17.0.1/test"
ENV AUTH_API_HOST=""
ENV AUTH_API_PORT=""

RUN yarn

EXPOSE 3000

CMD [ "bin/www" ]