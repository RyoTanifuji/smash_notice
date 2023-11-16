class CreateFolders < ActiveRecord::Migration[7.0]
  def change
    create_table :folders do |t|
      t.string :name, null: false
      t.string :type
      t.references :user, null: false, foreign_key: true
      t.references :fighter, null: false, foreign_key: true

      t.timestamps
    end
  end
end
