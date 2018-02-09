
# README

Rails app default port is 3000

## Routes

User signup
```bash
$> curl -XPOST localhost:3000/auth/ --data "email=tpayet@student.42.fr&password=QWErty123&password_confirmation=QWErty123"
```

User login
```bash
# Add --verbose to see header with token and client
curl -XPOST localhost:3000/auth/sign_in --data "email=tpayet@student.42.fr&password=rockmyroot"
```

For more details about authentification system please see the [gem docutmentation](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

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

