class Api::MemosController < ApplicationController
  before_action :set_folder, only: %i[index create]
  before_action :set_memo, only: %i[show update destroy]

  def index
    render json: @folder, include: [{memos: {except: [:user_id, :created_at]}}]
  end

  def create
    @memo = current_user.memos.build(memo_params)
    @memo.folder = @folder
    @memo.title = Fighter.find(@memo.fighter_id).name if @memo.title.blank?

    if @memo.save
      render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
    else
      render json: @memo.errors.full_messages, status: :bad_request
    end
  end

  def show
    render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
  end

  def update
    @memo.assign_attributes(memo_params)
    @memo.title = Fighter.find(@memo.fighter_id).name if @memo.title.blank?

    if @memo.save
      render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
    else
      render json: @memo.errors.full_messages, status: :bad_request
    end
  end

  def destroy
    @memo.destroy!
    render json: @memo
  end

  private

  def set_folder
    @folder = current_user.folders.find(params[:folder_id])
  end

  def set_memo
    @memo = current_user.memos.find(params[:id])
  end

  def memo_params
    params.require(:memo).permit(:title, :type, :fighter_id, :state)
  end
end
