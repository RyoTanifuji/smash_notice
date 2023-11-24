class Api::MemosController < ApplicationController
  before_action :set_folder, only: %i[index]

  def index
    @memos = @folder.memos
    render json: @memos.to_json(except: [:user_id, :created_at])
  end

  private

  def set_folder
    @folder = current_user.folders.find(params[:folder_id])
  end
end
