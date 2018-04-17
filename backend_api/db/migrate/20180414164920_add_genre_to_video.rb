class AddGenreToVideo < ActiveRecord::Migration[5.1]
  def change
    add_column :videos, :genre, :string
  end
end
