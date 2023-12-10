class Embed < ApplicationRecord
  has_one :memo_block, as: :blockable, dependent: :destroy
  has_one :memo, through: :memo_block

  validates :subtitle, length: { maximum: 20 }
  validates :identifier, length: { maximum: 200 }

  enum embed_type: { youtube: 0 }

  def picture_url
    nil
  end
end
