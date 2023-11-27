class Sentence < ApplicationRecord
  has_one :memo_block, as: :blockable, dependent: :destroy
  has_one :memo, through: :memo_block
end
