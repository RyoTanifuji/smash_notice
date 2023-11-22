class Folder < ApplicationRecord
  belongs_to :user
  belongs_to :fighter

  validates :name, presence: true, length: { maximum: 20 }
end
