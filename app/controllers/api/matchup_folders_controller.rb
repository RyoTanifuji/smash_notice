class Api::MatchupFoldersController < ApplicationController
  def create
    folder = current_user.matchup_folders.build(folder_params)

    if folder.save
      render json: folder
    else
      render json: folder.errors.full_messages, status: :bad_request
    end
  end

  private

  def folder_params
    params.require(:folder).permit(:name, :fighter_id)
  end
end
