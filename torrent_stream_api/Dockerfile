FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_9.x | sh

RUN apt-get install -y nodejs

RUN apt-get install -y  software-properties-common python-software-properties

RUN add-apt-repository ppa:jonathonf/ffmpeg-3

RUN apt-get update

RUN apt-get install -y ffmpeg

RUN mkdir /app

WORKDIR /app

RUN mkdir /data

COPY package.json ./package.json

RUN npm install

COPY . .
