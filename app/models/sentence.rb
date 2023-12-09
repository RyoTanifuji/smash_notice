class Sentence < ApplicationRecord
  has_one :memo_block, as: :blockable, dependent: :destroy
  has_one :memo, through: :memo_block

  validates :subtitle, length: { maximum: 20 }
  validates :body, length: { maximum: 65535 }

  def picture_url
    nil
  end
end
