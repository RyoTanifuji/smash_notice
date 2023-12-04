class CreateMemoBlocks < ActiveRecord::Migration[7.0]
  def change
    create_table :memo_blocks do |t|
      t.references :memo, foreign_key: true
      t.references :blockable, polymorphic: true
      t.integer :level, default: 0, null: false

      t.timestamps
      t.index :level
    end
  end
end
