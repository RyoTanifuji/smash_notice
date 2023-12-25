class User < ApplicationRecord
  include JwtToken
  authenticates_with_sorcery!

  has_many :folders, dependent: :destroy
  has_many :matchup_folders, dependent: :destroy
  has_many :strategy_folders, dependent: :destroy
  has_many :memos, dependent: :destroy
  has_many :bookmarks, -> { order(created_at: :desc) }, dependent: :destroy
  has_many :bookmark_memos, through: :bookmarks, source: :memo

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }

  validates :name, presence: true, length: { maximum: 20 }
  validates :email, uniqueness: true, presence: true

  def bookmark(memo)
    bookmark_memos << memo
  end

  def unbookmark(memo)
    bookmark_memos.destroy(memo)
  end
end
