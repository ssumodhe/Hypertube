Devise.setup do |config|
  config.authentication_keys = [:username]
  config.secret_key = ENV['DEVISE_SECRET_KEY'] if Rails.env.production?
  config.password_length = 6..128

  config.navigational_formats = [:json]
end
