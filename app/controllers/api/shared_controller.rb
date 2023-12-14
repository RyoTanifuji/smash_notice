class Api::SharedController < ApplicationController
  def index
    @memos = Memo.shared
    render json: @memos, methods: [:type]
  end
end
