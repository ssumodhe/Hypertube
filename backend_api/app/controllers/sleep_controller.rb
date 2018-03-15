class SleepController < ApplicationController
  def time
    sleep sleep_params.to_i
    render 200
  end

  def sleep_params
    params.require(:time)
  end
end
