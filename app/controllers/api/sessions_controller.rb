class Api::SessionsController < ApplicationController
  skip_before_action :authenticate!, only: %i[create]

  def create
    user = User.authenticate(params[:email], params[:password])

    if user
      token = user.create_tokens
      render json: { token: }
    else
      head :unauthorized
    end
  end
end
