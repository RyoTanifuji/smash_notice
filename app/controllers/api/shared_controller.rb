class Api::SharedController < ApplicationController
  skip_before_action :authenticate!, only: %i[index]

  def index
    @memos = Memo.where(type: params[:type]).shared.order(updated_at: :desc).page(params[:page]).per(12)
    render json: {
      memos: @memos.as_json(methods: [:type, :sentence_body], include: [user: {only: :name}]),
      total_pages: @memos.total_pages
    }
  end
end
