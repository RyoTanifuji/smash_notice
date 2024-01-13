class ProfilePolicy < Struct.new(:user, :profile)
  def update?
    user.general?
  end
end