class Api::SharedController < ApplicationController
  skip_before_action :authenticate!, only: %i[index show]

  def index
    @memos = Memo.where(type: params[:type]).shared.order(updated_at: :desc).page(params[:page]).per(12)
    @bookmark_memo_ids = current_user ? current_user.bookmark_memo_ids : []
    render json: {
      memos: @memos.as_json(methods: [:type, :sentence_body], include: [user: {only: :name}]),
      total_pages: @memos.total_pages,
      bookmark_memo_ids: @bookmark_memo_ids
    }
  end

  def show
    @memo = Memo.shared.find(params[:id])
    @bookmark_memo_ids = current_user ? current_user.bookmark_memo_ids : []
    render json: {
      memo: @memo.as_json(methods: [:type], include: [{memo_blocks: {include: [blockable: {methods: :picture_url}]}}, user: {only: :name}]),
      bookmark_memo_ids: @bookmark_memo_ids
    }
  end
end
