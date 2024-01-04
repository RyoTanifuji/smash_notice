class Api::BookmarksController < ApplicationController
  def create
    authorize(Bookmark)

    @memo = Memo.shared.find(params[:memo_id])
    current_user.bookmark(@memo)
  end

  def destroy
    authorize(Bookmark)

    @memo = current_user.bookmark_memos.find(params[:memo_id])
    current_user.unbookmark(@memo)
  end
end
