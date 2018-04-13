class CreatePerformances < ActiveRecord::Migration[5.1]
  def change
    create_table :performances do |t|
      t.references :user, foreign_key: true
      t.references :video, foreign_key: true

      t.timestamps
    end
  end
end
