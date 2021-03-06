

# README

Rails app default port is 3000

## Routes

#### Sleep routes
```bash
$> curl https://hypertubeapi.tpayet.com/sleep?time=10
# this route will take 10 sec to answer
```

#### User signup
```bash
$> curl -XPOST https://hypertubeapi.tpayet.com/auth/ --data "email=totolapaille@gmail.com&username=totolapaille&password=QWErty123&password_confirmation=QWErty123&firstname=Thomas&lastname=Payet"
```

#### Authentication
```bash
# Add --verbose to see header with token and client
$> curl -XPOST https://hypertubeapi.tpayet.com/auth/sign_in --data "username=tpayet&password=QWErty123"

# This route gives you access-token, client, expiry, token-type and uid you must set in you header for later request
```

For more details about authentification system please see the [gem documentation](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

#### Search Route
```bash
$> curl https://hypertubeapi.tpayet.com/search?query=james+bond

# default engine is pirate_bay but you can specify rarbg
$> curl https://hypertubeapi.tpayet.com/search?query=james+bond&engine=rarbg
```

#### Download Route
```bash
$> curl -XPOST localhost:3000/streaming/download -d '{"streaming": {"url": "http://www.torrent9.red/get_torrent/interstellar-french-dvdrip-2014.torrent"}}' -H "Content-Type: application/json"
{"videoUrl":"https://streamingapi.tpayet.com//video/2bbfa58659e8d9541e803a4b803d2352b8bc4ecb","subtitles":{"fr":"https://streamingapi.tpayet.com//subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt","en":"https://streamingapi.tpayet.com//subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt"}}
```

#### Get users data
These routes need [authentication](https://github.com/tpayet/Hypertube/tree/master/backend_api#authentication)
```bash
$> curl https://hypertubeapi.tpayet.com/users/:username

$> curl https://hypertubeapi.tpayet.com/users/:username/avatar
```

#### Update users data
This route need [authentication](https://github.com/tpayet/Hypertube/tree/master/backend_api#authentication)
```bash
# PUT /auth
$> curl -XPUT -H "auth headers ..." -H "Content-Type: application/json" -d '{ "email":... }' "http://192.168.99.100:3000/auth"
# Possible params are username, email, password, password_confirmation, current_password, firstname, lastname
```

#### Videos Models
```bash
# POST /videos
$> curl -XPOST https://hypertubeapi.tpayet.com/videos -H "Content-Type: application/json" -d '{"video": {"token":"123", "path":"/", "title":"wololo", "subtitles_fr":"path", "subtitles_en":"path"}}'
{"id":5,"title":"wololo","path":"/","token":"123","created_at":"2018-03-02T14:16:25.391Z","updated_at":"2018-03-02T14:16:25.391Z"}
# Possible params are title, path, token, subtitles_fr, subtitles_en, content_rating, runtime, description, rating, poster, director, metascore, writer

# GET /videos/:token
$> curl https://hypertubeapi.tpayet.com/videos/123
{"id":4,"title":"wololo","path":"/","token":"123","created_at":"2018-03-02T13:45:43.779Z","updated_at":"2018-03-02T13:45:43.779Z"}

# DELETE /videos/:token
$> curl -XDELETE https://hypertubeapi.tpayet.com/videos/123
```
These route needs [authentication](https://github.com/tpayet/Hypertube/tree/master/backend_api#authentication)
```bash
# GET /videos (index)
$> curl https://hypertubeapi.tpayet.com/videos

# GET /videos/:token/comments
$> curl https://hypertubeapi.tpayet.com/videos/:token/comments
[{"id":1,"body":"hello","user_id":7,"video_id":6,"created_at":"2018-03-10T18:27:33.853Z","updated_at":"2018-03-10T18:27:33.853Z"}]
```

##### Register video played by user

You should call the following route with your authentication headers
```bash
# GET /videos/:token/perform
$> curl https://hypertubeapi.tpayet.com/videos/qwerty/perform
{"id":3,"user_id":7,"video_id":1,"created_at":"2018-04-13T12:48:02.939Z","updated_at":"2018-04-13T12:48:02.939Z"}
```

##### See all videos already played by user
```bash
# GET /users/:uid_or_username/performances
$> https://hypertubeapi.tpayet.com/users/tpayet%40student.42.fr/performances
[{"id":4,"user_id":17,"video_id":1,"created_at":"2018-04-13T13:01:54.717Z","updated_at":"2018-04-13T13:01:54.717Z"},{"id":5,"user_id":17,"video_id":6,"created_at":"2018-04-13T13:05:11.499Z","updated_at":"2018-04-13T13:05:11.499Z"}]
```
#### Comments routes

These route needs [authentication](https://github.com/tpayet/Hypertube/tree/master/backend_api#authentication)
```bash
# POST /comments (create comment)
curl https://hypertubeapi.tpayet.com/comments -XPOST -H "Content-Type: application/json" -d '{"comment": {"body": "prout", "user_id": 7, "video_id": 6}}'

# PUT /comments (update comment)
curl https://hypertubeapi.tpayet.com/comments/:id -XPUT -H "Content-Type: application/json" -d '{"comment": {"body": "wsh", "user_id": 7, "video_id": 6}}'
```

----


Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization
```bash
$> bundle exec rake db:create
$> bundle exec rake db:migrate
$> bundle exec rake db:seed
```
* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

## Usage
```bash
# Install dependencies
$> bundle install
# Create db && migration
$> bundle exec rake db:create && bundle exec rake db:migrate
# Seed db with first users
$> bundle exec rake db:seed
# Run the built-in server
$> rails s
```

## Install Ruby & RoR
On 42 school dump, you should install `ruby` via `rbenv` and `rbenv` via `brew`

```bash
# Install ruby 2.5.0 using rbenv
$> rbenv install 2.5.0
# And set it as default ruby binary to use
$> rbenv global 2.5.0
# Please verify you are using the wanted ruby installed, should be in .rbenv dir.
# If it's not the case, try reset you tty. You env variable may not be up to date.
$> which ruby
# Install rails gem
$> gem install rails
# Rails version should be at least 5.1.0
$> rails --version
```
