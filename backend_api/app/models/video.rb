class Video < ApplicationRecord
  has_many :comments
  has_many :performances

  def to_param
    token
  end
end
