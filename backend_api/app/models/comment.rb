class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :video
  alias_attribute :author, :user
end
