class Api::ProfileController < ApplicationController
  def update
    authorize(:profile, :update?)

    user = User.find(current_user.id)

    if user.update(user_params)
      render json: user
    else
      render json: user.errors.full_messages, status: :bad_request
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
