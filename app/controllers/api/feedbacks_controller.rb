class Api::FeedbacksController < ApplicationController
  def create
    authorize(Feedback)

    @feedback = Feedback.new(feedback_params)

    if @feedback.valid?
      FeedbackMailer.with(feedback: @feedback).send_feedback.deliver_now
      render json: @feedback
    else
      render json: @feedback.errors.full_messages, status: :bad_request
    end
  end

  private

  def feedback_params
    params.require(:feedback).permit(:category, :body)
  end
end
