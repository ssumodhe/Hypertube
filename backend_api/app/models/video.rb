class Video < ApplicationRecord
  has_many :comments
  has_many :performances
  before_destroy :delete_file

  def to_param
    token
  end

  def delete_file
    begin
      HTTParty.delete "#{ENV['STREAMING_API_URL']}/video/#{token}"
    rescue Exception
      puts "we are in dev :deso:"
    end
  end
end
