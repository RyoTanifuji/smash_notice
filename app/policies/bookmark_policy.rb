class BookmarkPolicy < ApplicationPolicy
  def create?
    user.general?
  end

  def destroy?
    user.general?
  end
end