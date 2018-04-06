class AddSubtitlesFrToVideos < ActiveRecord::Migration[5.1]
  def change
    add_column :videos, :subtitles_fr, :string
    add_column :videos, :subtitles_en, :string
  end
end
