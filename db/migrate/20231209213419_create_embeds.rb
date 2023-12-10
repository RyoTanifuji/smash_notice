class CreateEmbeds < ActiveRecord::Migration[7.0]
  def change
    create_table :embeds do |t|
      t.string :subtitle
      t.integer :embed_type, default: 0, null: false
      t.string :identifier

      t.timestamps
    end
  end
end
