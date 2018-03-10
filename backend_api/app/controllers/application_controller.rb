class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation, :firstname, :lastname])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :email, :password, :password_confirmation, :current_password, :firstname, :lastname])
  end

  private
  def logged_in?
    raise ActiveRecord::RecordNotFound unless user_signed_in?
  end
end
