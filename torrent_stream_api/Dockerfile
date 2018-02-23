FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install -y ffmpeg curl

RUN curl -sL https://deb.nodesource.com/setup_9.x | sh

RUN apt-get install -y nodejs

RUN mkdir /app

WORKDIR /app

RUN mkdir /data

COPY package.json ./package.json

RUN npm install

COPY . .
