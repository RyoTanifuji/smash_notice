class FeedbackMailer < ApplicationMailer
  def send_feedback
    @feedback = params[:feedback]
    mail(to: ENV["MAIL_ADDRESS"], subject: "【お問い合わせ】" + @feedback.category) do |format|
      format.text
    end
  end
end
