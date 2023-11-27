class MemoBlock < ApplicationRecord
  belongs_to :memo
  belongs_to :blockable, polymorphic: true, dependent: :destroy

  with_options on: %i[create update] do
    validates :blockable_type, presence: true
    validates :blockable_id, presence: true
    validates :level, presence: true, uniqueness: { scope: :memo_id }
  end

  with_options on: :insert do
    validates :level, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  end
end
