FROM ruby:2.4.0

RUN apt-get update && apt-get install build-essential nodejs libpq-dev imagemagick -y

RUN apt-get install libsqlite3-dev -y

RUN mkdir /app

WORKDIR /app

COPY Gemfile ./Gemfile

COPY Gemfile.lock ./Gemfile.lock

RUN bundle install

COPY . .

RUN chmod +x /app/entrypoint.sh