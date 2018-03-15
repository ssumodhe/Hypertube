class Users::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
  before_action :set_user

  def github
    # @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user
  end

  def marvin
    byebug
    sign_in_and_redirect @user
  end

  private
  def set_user
    @user = User.from_omniauth(request.env["omniauth.auth"])
  end
end