Rails.application.config.middleware.use OmniAuth::Builder do
	provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET_KEY'], scope: 'email,profile'
	provider :facebook, ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET_KEY']
end

DeviseTokenAuth::OmniauthCallbacksController.class_eval do
	def resource_class(mapping = nil)
	  if devise_params
	    devise_params['resource_class'].constantize
	  end              
	end
end
