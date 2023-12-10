class Memo < ApplicationRecord
  belongs_to :user
  belongs_to :folder

  has_many :memo_blocks, -> { order(level: :desc) }, inverse_of: :memo, dependent: :destroy
  has_many :sentences, through: :memo_blocks, source: :blockable, source_type: 'Sentence'

  validates :title, presence: true, length: { maximum: 20 }

  enum state: { local: 0, shared: 1  }
end
