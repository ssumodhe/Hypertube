class SleepController < ApplicationController
  def time
    sleep sleep_params.to_i
    render plain: "Tu veux une croquette ?\n", status: :ok
  end

  def sleep_params
    params.require(:time)
  end
end
