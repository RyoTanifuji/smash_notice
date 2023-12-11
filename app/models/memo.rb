class Memo < ApplicationRecord
  belongs_to :user
  belongs_to :folder
  belongs_to :fighter
  belongs_to :opponent, class_name: "Fighter", foreign_key: :opponent_id

  has_many :memo_blocks, -> { order(level: :desc) }, inverse_of: :memo, dependent: :destroy
  has_many :sentences, through: :memo_blocks, source: :blockable, source_type: 'Sentence'
  has_many :images, through: :memo_blocks, source: :blockable, source_type: 'Image'
  has_many :embeds, through: :memo_blocks, source: :blockable, source_type: 'Embed'

  validates :title, presence: true, length: { maximum: 30 }

  enum state: { local: 0, shared: 1 }
end
