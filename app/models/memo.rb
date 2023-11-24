class Memo < ApplicationRecord
  belongs_to :user
  belongs_to :folder

  validates :title, presence: true, length: { maximum: 20 }
  enum status: { private: 1, public: 2 }
end
