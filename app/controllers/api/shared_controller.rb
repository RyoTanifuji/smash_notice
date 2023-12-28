class Api::SharedController < ApplicationController
  skip_before_action :authenticate!, only: %i[index show bookmarks]

  def index
    @memos = Memo.where(type: params[:type]).shared.order(updated_at: :desc).page(params[:page]).per(12).includes([:user, :sentences])
    @bookmark_memo_ids = current_user ? current_user.bookmark_memo_ids : []
    render json: {
      memos: @memos.as_json(methods: [:type, :sentence_body], include: [user: { only: :name }]),
      total_pages: @memos.total_pages,
      bookmark_memo_ids: @bookmark_memo_ids
    }
  end

  def show
    @memo = Memo.shared.find(params[:id])
    @memo_blocks = @memo.memo_blocks.includes(:blockable)
    @bookmark_memo_ids = current_user ? current_user.bookmark_memo_ids : []
    render json: {
      memo: @memo.as_json(methods: [:type], include: [user: { only: :name }]),
      memo_blocks: @memo_blocks.as_json(include: [blockable: { methods: :picture_url }]),
      bookmark_memo_ids: @bookmark_memo_ids
    }
  end

  def bookmarks
    @memos = current_user ? current_user.bookmark_memos.page(params[:page]).per(12).includes([:user, :sentences]) : Memo.none.page
    @bookmark_memo_ids = current_user ? current_user.bookmark_memo_ids : []
    render json: {
      memos: @memos.as_json(methods: [:type, :sentence_body], include: [user: { only: :name }]),
      total_pages: @memos.total_pages,
      bookmark_memo_ids: @bookmark_memo_ids
    }
  end
end
