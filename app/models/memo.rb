class Memo < ApplicationRecord
  belongs_to :user
  belongs_to :folder

  validates :title, presence: true, length: { maximum: 20 }

  enum state: { local: 1, shared: 2 }
end
