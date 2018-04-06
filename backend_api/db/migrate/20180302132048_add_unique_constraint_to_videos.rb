class AddUniqueConstraintToVideos < ActiveRecord::Migration[5.1]
  def change
    add_index :videos, :token, unique: true
  end
end
