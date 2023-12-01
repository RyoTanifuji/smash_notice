class Api::MemoBlocksController < ApplicationController
  before_action :set_memo, only: %i[create update]
  before_action :set_memo_block, only: %i[update]

  def create
    MemoBlock.transaction do
      @memo_block = @memo.memo_blocks.new(memo_block_params)

      blockable_type = params.dig(:memo_block, :blockable_type)

      if blockable_type.blank? || !MemoBlock.valid_blockable_type?(blockable_type)
        return head :bad_request
      end

      @memo_block.create_blockable!(blockable_type)

      if @memo_block.invalid?(:insert)
        return head :bad_request
      end

      @memo_block.insert_and_save!
    end

    if @memo_block.blockable.update(blockable_params)
      render json: @memo_block, include: [:blockable]
    else
      render json: @memo_block.blockable.errors.full_messages, status: :bad_request
    end
  end

  def update
    if @memo_block.blockable.update(blockable_params)
      render json: @memo_block, include: [:blockable]
    else
      render json: @memo_block.blockable.errors.full_messages, status: :bad_request
    end
  end

  private

  def set_memo
    @memo = current_user.memos.find(params[:memo_id])
  end

  def set_memo_block
    @memo_block = @memo.memo_blocks.find(params[:id])
  end

  def memo_block_params
    params.require(:memo_block).permit(:level, :blockable_type)
  end

  def blockable_params
    if params.key?(:sentence)
      sentence_params
    else
      raise ActionController::ParameterMissing, :blockable
    end
  end

  def sentence_params
    params.require(:sentence).permit(:subtitle, :body)
  end
end
