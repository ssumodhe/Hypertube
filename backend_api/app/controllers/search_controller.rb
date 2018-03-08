class SearchController < ApplicationController
  def query
    results = if search_params['engine'] == 'rarbg'
                rarbg_search search_params['query']
              else
                pirate_bay_search search_params['query']
              end

    render json: results.to_json
  end

  private

  def pirate_bay_search(query)
    TorrentApi.new :pirate_bay, query
  end

  def rarbg_search(query)
    rarbg = RARBG::API.new
    rarbg.search_string query
  end

  def search_params
    params.permit :query, :engine
  end
end
