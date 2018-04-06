class StreamingController < ApplicationController
  def download
    streaming_api_url = Rails.application.config_for(:streaming_api)['url']
    response = HTTParty.post "#{streaming_api_url}/url",
                             headers: { 'Content-Type': 'application/json' },
                             body: streaming_params.to_json

    render json: response.to_h
  end

  private

  def streaming_params
    params.require('streaming').permit :title, :url
  end
end
