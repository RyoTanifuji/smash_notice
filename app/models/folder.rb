class Folder < ApplicationRecord
  belongs_to :user
  belongs_to :fighter

  has_many :memos, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
end
