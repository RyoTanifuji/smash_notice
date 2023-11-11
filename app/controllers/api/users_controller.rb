class Api::UsersController < ApplicationController
  before_action :authenticate!, only: %i[me]

  def create
    user = User.new(user_params)

    if user.save
      render json: user
    else
      render json: user.errors.full_messages, status: :bad_request
    end
  end

  def me
    render json: current_user, methods: [:avatar_url]
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
