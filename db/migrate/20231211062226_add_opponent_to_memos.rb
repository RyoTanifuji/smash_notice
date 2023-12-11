class AddOpponentToMemos < ActiveRecord::Migration[7.0]
  def change
    add_reference :memos, :opponent, foreign_key: { to_table: :fighters }
  end
end
