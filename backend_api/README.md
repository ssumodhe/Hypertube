
# README

Rails app default port is 3000

## Routes

User signup
```bash
$> curl -XPOST https://hypertubeapi.tpayet.com/auth/ --data "email=totolapaille@gmail.com&username=totolapaille&password=QWErty123&password_confirmation=QWErty123&firstname=Thomas&lastname=Payet"
```

User login
```bash
# Add --verbose to see header with token and client
$> curl -XPOST https://hypertubeapi.tpayet.com/auth/sign_in --data "username=tpayet&password=QWErty123"
```

For more details about authentification system please see the [gem docutmentation](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

Search Route
```bash
$> curl https://hypertubeapi.tpayet.com/search?query=james+bond

# default engine is pirate_bay but you can specify rarbg
$> curl https://hypertubeapi.tpayet.com/search?query=james+bond&engine=rarbg
```

Get users data
```bash
$> curl https://hypertubeapi.tpayet.com/users/:username

# You must have in your headers: access-token, client, expiry, token-type and uid
```

Videos Models
```bash
# POST /videos
$> curl -XPOST https://hypertubeapi.tpayet.com/videos -H "Content-Type: application/json" -d '{"video": {"token":"123", "path":"/", "title":"wololo", "subtitles_fr":"path", "subtitles_en":"path"}}'
{"id":5,"title":"wololo","path":"/","token":"123","created_at":"2018-03-02T14:16:25.391Z","updated_at":"2018-03-02T14:16:25.391Z"}

# GET /videos/:token
$> curl https://hypertubeapi.tpayet.com/videos/123
{"id":4,"title":"wololo","path":"/","token":"123","created_at":"2018-03-02T13:45:43.779Z","updated_at":"2018-03-02T13:45:43.779Z"}

# DELETE /videos/:token
$> curl -XDELETE https://hypertubeapi.tpayet.com/videos/123

# GET /videos (index)
$> curl https://hypertubeapi.tpayet.com/videos

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

