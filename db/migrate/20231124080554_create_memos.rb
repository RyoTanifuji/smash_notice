class CreateMemos < ActiveRecord::Migration[7.0]
  def change
    create_table :memos do |t|
      t.string :title, null: false
      t.integer :state, default: 1
      t.string :type
      t.references :user, null: false, foreign_key: true
      t.references :folder, null: false, foreign_key: true
      t.references :fighter, foreign_key: true

      t.timestamps
    end
  end
end
