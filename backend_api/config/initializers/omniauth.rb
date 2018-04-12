Rails.application.config.middleware.use OmniAuth::Builder do
  provider :marvin, ENV['FT_API_KEY'], ENV['FT_SECRET_API_KEY']
end
