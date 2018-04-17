class AddYearToVideo < ActiveRecord::Migration[5.1]
  def change
    add_column :videos, :year, :string
  end
end
