class AddUrDownloadToVideo < ActiveRecord::Migration[5.1]
  def change
    add_column :videos, :download, :string
    add_column :videos, :url, :string
  end
end
