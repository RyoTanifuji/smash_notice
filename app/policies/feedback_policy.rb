class FeedbackPolicy < ApplicationPolicy
  def create?
    user.general?
  end
end