class Video < ApplicationRecord
  has_many :comments

  def to_param
    token
  end
end
