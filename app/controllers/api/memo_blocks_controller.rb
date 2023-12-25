class Api::MemoBlocksController < ApplicationController
  before_action :set_memo, only: %i[create update destroy]
  before_action :set_memo_block, only: %i[update destroy]

  def create
    MemoBlock.transaction do
      @memo_block = @memo.memo_blocks.new(memo_block_params)

      blockable_type = params.dig(:memo_block, :blockable_type)

      return head :bad_request if blockable_type.blank? || !MemoBlock.valid_blockable_type?(blockable_type)

      @memo_block.create_blockable!(blockable_type, blockable_params)

      return head :bad_request if @memo_block.invalid?(:insert)

      @memo_block.insert_and_save!
    end

    render json: @memo_block, include: [{ blockable: { methods: :picture_url } }]
  end

  def update
    @blockable = @memo_block.blockable

    if @blockable.update(blockable_params)
      @blockable.parse_base64(image_params[:file]) if params.key?(:image)
      render json: @memo_block, include: [{ blockable: { methods: :picture_url } }]
    else
      render json: @blockable.errors.full_messages, status: :bad_request
    end
  end

  def destroy
    @memo_block.destroy!
    render json: @memo_block
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
    elsif params.key?(:image)
      image_params
    elsif params.key?(:embed)
      embed_params
    else
      raise ActionController::ParameterMissing, :blockable
    end
  end

  def sentence_params
    params.require(:sentence).permit(:subtitle, :body)
  end

  def image_params
    params.require(:image).permit(:subtitle, :file, :picture_width)
  end

  def embed_params
    params.require(:embed).permit(:subtitle, :embed_type, :identifier)
  end
end
