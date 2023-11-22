class RemoveTimestampFromFighters < ActiveRecord::Migration[7.0]
  def change
    remove_column :fighters, :created_at, :datetime
    remove_column :fighters, :updated_at, :datetime
  end
end
