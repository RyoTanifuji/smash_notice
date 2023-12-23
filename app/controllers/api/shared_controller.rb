class Api::SharedController < ApplicationController
  skip_before_action :authenticate!, only: %i[index show]

  def index
    @memos = Memo.where(type: params[:type]).shared.order(updated_at: :desc).page(params[:page]).per(12)
    render json: {
      memos: @memos.as_json(methods: [:type, :sentence_body], include: [user: {only: :name}]),
      total_pages: @memos.total_pages
    }
  end

  def show
    @memo = Memo.shared.find(params[:id])
    render json: @memo, include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}, user: {only: :name}]
  end
end
