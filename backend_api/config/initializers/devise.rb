Devise.setup do |config|
  config.authentication_keys = [:username]
  config.secret_key = ENV['DEVISE_SECRET_KEY'] if Rails.env.production?
end
