class ChangeStateDefaultOnMemos < ActiveRecord::Migration[7.0]
  def change
    change_column_default :memos, :state, from: 1, to: 0
  end
end
