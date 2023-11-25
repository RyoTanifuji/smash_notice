class Api::MemosController < ApplicationController
  before_action :set_folder, only: %i[index]

  def index
    render json: @folder, include: [{memos: {except: [:user_id, :created_at]}}]
  end

  private

  def set_folder
    @folder = current_user.folders.find(params[:folder_id])
  end
end
