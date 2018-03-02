FROM ruby:2.4.0

RUN apt-get update && apt-get install build-essential nodejs libpq-dev -y

RUN apt-get install libsqlite3-dev -y

RUN mkdir /app

WORKDIR /app

COPY Gemfile ./Gemfile

COPY Gemfile.lock ./Gemfile.lock

RUN bundle install

COPY . .






