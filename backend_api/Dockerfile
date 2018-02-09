FROM ruby:2.4.0

RUN apt-get update && apt-get install nodejs -y

RUN apt-get install libsqlite3-dev -y

RUN mkdir /app

WORKDIR /app

COPY Gemfile ./Gemfile

COPY Gemfile.lock ./Gemfile.lock

RUN bundle install

COPY . .

RUN rails db:create

RUN rails db:migrate

RUN rails db:seed
