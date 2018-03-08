class SearchController < ApplicationController
  def query
    client = TorrentApi.new

    client.search_term = search_params
    results = client.search

    render json: results.to_json
  end

  def search_params
    params.require(:query)
  end
end
