Rails.application.config.middleware.use OmniAuth::Builder do
  provider :marvin, ENV['FT_API_KEY'], ENV['FT_SECRET_API_KEY']
  provider :github, ENV['GITHUP_API_KEY'], ENV['GITHUB_SECRET_API_KEY'], scope: 'email,profile'
  provider :twitter, ENV['TWITTER_API_KEY'], ENV['TWITTER_SECRET_API_KEY']
end
