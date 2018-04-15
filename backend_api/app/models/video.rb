class Video < ApplicationRecord
  has_many :comments
  has_many :performances
  before_destroy :delete_file

  def to_param
    token
  end

  def delete_file
    HTTParty.delete "$[STREAMING_API_URL]/video/#{token}"
  end
end
