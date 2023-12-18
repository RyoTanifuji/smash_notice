class Api::SharedController < ApplicationController
  skip_before_action :authenticate!, only: %i[index]

  def index
    @memos = Memo.shared.order(updated_at: :desc)
    render json: @memos, methods: [:type, :sentence_body], include: [user: {only: :name}]
  end
end
