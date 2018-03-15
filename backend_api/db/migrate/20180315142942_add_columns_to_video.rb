class AddColumnsToVideo < ActiveRecord::Migration[5.1]
  def change
    add_column :videos, :content_rating, :string
    add_column :videos, :runtime, :string
    add_column :videos, :description, :string
    add_column :videos, :rating, :string
    add_column :videos, :poster, :string
    add_column :videos, :director, :string
    add_column :videos, :metascore, :string
    add_column :videos, :writer, :string
  end
end
