class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy, :avatar, :performances]
  before_action :logged_in?, except: [:avatar, :performances]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  def avatar
    if @user.provider == 'email'
      send_file @user.picture.path, type: 'image/jpeg', disposition: :inline
    else
      redirect_to @user.image
    end
  end

  def performances
    perfs = Performance.where(user: @user)

    render json: perfs
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by_username(params[:username]) || User.find_by_uid(params[:username])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.fetch(:user, {})
    end
end
