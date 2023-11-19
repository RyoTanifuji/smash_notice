class Api::FoldersController < ApplicationController
  def create
    folder = current_user.folders.build(folder_params)

    if folder.save
      render json: folder
    else
      render json: folder.errors.full_messages, status: :bad_request
    end
  end

  private

  def folder_params
    params.require(:folder).permit(:name, :type, :fighter_id)
  end
end
