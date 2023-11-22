class Api::FoldersController < ApplicationController
  def create
    folder = current_user.folders.build(folder_params)
    folder.name = Fighter.find(folder.fighter_id).name if folder.name.blank?

    if folder.save
      render json: folder
    else
      render json: folder.errors.full_messages, status: :bad_request
    end
  end

  def matchup
    folders = current_user.matchup_folders.all
    render json: folders.to_json(except: [:user_id])
  end

  def strategy
    folders = current_user.strategy_folders.all
    render json: folders.to_json(except: [:user_id])
  end

  private

  def folder_params
    params.require(:folder).permit(:name, :type, :fighter_id)
  end
end
