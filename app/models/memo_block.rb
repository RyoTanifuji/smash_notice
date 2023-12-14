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

  class << self
    def blockable_types
      %w[Sentence Image Embed]
    end

    def valid_blockable_type?(type)
      blockable_types.include?(type.to_s.classify)
    end
  end

  def create_blockable!(type, blockable_params)
    case type
    when "Sentence"
      self.blockable = Sentence.create!(blockable_params)
    when "Image"
      self.blockable = Image.create!(blockable_params)
      self.blockable.parse_base64(blockable_params[:file])
    when "Embed"
      self.blockable = Embed.create!(blockable_params)
    else
      raise "不正なブロックタイプです (#{type})"
    end

    blockable
  end

  def insert_and_save!
    # levelをずらす
    memo_blocks = memo.memo_blocks.where('level >= ?', level).reorder(level: :desc)
    memo_blocks.each do |memo_block|
      memo_block.level += 1
      memo_block.save!
    end
    save!
  end
end
