class Api::MemosController < ApplicationController
  before_action :set_folder, only: %i[index create template]
  before_action :set_memo, only: %i[show update destroy]

  def index
    render json: @folder, methods: [:memos_excluded_template]
  end

  def create
    Memo.transaction do
      @memo = current_user.memos.build(memo_params.merge(
        folder: @folder,
        fighter: @folder.fighter
      ))
      @memo.title = @memo.opponent.name if @memo.title.blank? && @memo.type == "MatchupMemo"

      @memo.save!

      @memo.apply_template! if apply_template?
    end

    render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
  end

  def show
    render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
  end

  def update
    @memo.assign_attributes(memo_params)
    @memo.title = @memo.opponent.name if @memo.title.blank? && @memo.type == "MatchupMemo"

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

  def template
    @template_memo = @folder.template_memo
    render json: @template_memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}]
  end

  private

  def set_folder
    @folder = current_user.folders.find(params[:folder_id])
  end

  def set_memo
    @memo = current_user.memos.find(params[:id])
  end

  def memo_params
    params.require(:memo).permit(:title, :type, :opponent_id, :state)
  end

  def apply_template?
    ActiveRecord::Type::Boolean.new.cast(params[:apply_template])
  end
end
