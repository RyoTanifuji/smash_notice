class AddPictureWidthToImages < ActiveRecord::Migration[7.0]
  def change
    add_column :images, :picture_width, :integer, default: 500
  end
end
