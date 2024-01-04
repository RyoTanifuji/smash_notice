class Api::UsersController < ApplicationController
  skip_before_action :authenticate!, only: %i[create create_demo]

  def create
    user = User.new(user_params)

    if user.save
      render json: user
    else
      render json: user.errors.full_messages, status: :bad_request
    end
  end

  def create_demo
    user = User.new({
      name: "デモユーザー",
      email: User.unused_demo_email,
      role: :demo,
      password: "password",
      password_confirmation: "password"
    })

    if user.save
      render json: user
    else
      head :internal_server_error
    end
  end

  def me
    render json: current_user
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
