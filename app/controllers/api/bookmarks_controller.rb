class Api::BookmarksController < ApplicationController
  def create
    @memo = Memo.shared.find(params[:memo_id])
    current_user.bookmark(@memo)
  end

  def destroy
    @memo = current_user.bookmark_memos.find(params[:memo_id])
    current_user.unbookmark(@memo)
  end
end
