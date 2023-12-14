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

  def apply_template!
    return nil if folder.type != "MatchupFolder"
    template_memo_blocks = folder.template_memo.memo_blocks
    template_memo_blocks.each do |template_memo_block|
      blockable = template_memo_block.blockable.dup
      blockable.save!
      memo_block = template_memo_block.dup
      memo_block.attributes = { blockable: blockable, memo: self }
      memo_block.save!
    end
  end
end
