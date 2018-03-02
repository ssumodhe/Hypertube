class Video < ApplicationRecord
  def to_param
    token
  end
end
