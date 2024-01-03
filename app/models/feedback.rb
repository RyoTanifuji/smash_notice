class Feedback
  include ActiveModel::Model

  attr_accessor :category, :body
  validates :category, presence: true, length: { maximum: 30 }
  validates :body, presence: true, length: { maximum: 1000 }
end