class VideosController < ApplicationController
  before_action :set_video, only: [:show, :update, :destroy]
  before_action :logged_in?, only: [:perform]

  # GET /videos
  def index
    @videos = Video.all

    render json: @videos
  end

  # GET /videos/1
  def show
    render json: @video
  end

  # POST /videos
  def create
    @video = Video.new(video_params)

    if @video.save
      render json: @video, status: :created, location: @video
    else
      render json: @video.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /videos/1
  def update
    if @video.update(video_params)
      render json: @video
    else
      render json: @video.errors, status: :unprocessable_entity
    end
  end

  # DELETE /videos/1
  def destroy
    @video.destroy
  end

  def comments
    @video = Video.find_by_token(params[:video_token])
    comments = @video.comments.joins(:user)
                              .select(User.arel_table[:username])
                              .select(Comment.arel_table[:body])
                              .select(Comment.arel_table[:created_at])
    render json: comments
  end

  def perform
    @video = Video.find_by_token(params[:video_token])
    perf = Performance.new(user: current_user, video: @video)
    if perf.save
      render json: perf, status: :ok
    else
      render json: perf.errors, stauts: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_video
      @video = Video.find_by_token(params[:token])
    end

    # Only allow a trusted parameter "white list" through.
    def video_params
      params.require(:video).permit(:title, :path, :token, :subtitles_fr,
        :subtitles_en, :content_rating, :runtime, :description, :rating,
        :poster, :director, :metascore, :writer, :genre, :download, :url, :year)
    end
end
