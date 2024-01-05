class ApplicationController < ActionController::Base
  include Api::UserAuthenticator
  include Pundit

  before_action :authenticate!
  protect_from_forgery with: :null_session
end
