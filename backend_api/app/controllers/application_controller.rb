class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?
  include DeviseTokenAuth::Concerns::SetUserByToken

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation, :firstname, :lastname, :image_base])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :email, :password, :password_confirmation, :current_password, :firstname, :lastname, :image_base])
  end

  private
  def logged_in?
    raise ActiveRecord::RecordNotFound unless user_signed_in?
  end
end
