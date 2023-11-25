class Api::FoldersController < ApplicationController
  before_action :set_folder, only: %i[update destroy]

  def index
    @folders = current_user.folders.where(type: params[:type])
    render json: @folders.to_json(except: [:user_id, :created_at])
  end

  def create
    @folder = current_user.folders.build(folder_params)
    @folder.name = Fighter.find(@folder.fighter_id).name if @folder.name.blank?

    if @folder.save
      render json: @folder.to_json(except: [:user_id, :created_at])
    else
      render json: @folder.errors.full_messages, status: :bad_request
    end
  end

  def update
    @folder.assign_attributes(folder_params)
    @folder.name = Fighter.find(@folder.fighter_id).name if @folder.name.blank?

    if @folder.save
      render json: @folder.to_json(except: [:user_id, :created_at])
    else
      render json: @folder.errors.full_messages, status: :bad_request
    end
  end

  def destroy
    @folder.destroy!
    render json: @folder
  end

  private

  def set_folder
    @folder = current_user.folders.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:name, :type, :fighter_id)
  end
end