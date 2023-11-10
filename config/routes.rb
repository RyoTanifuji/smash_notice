Rails.application.routes.draw do
  root 'top#index'
  namespace :api do
    resources :users
  end

  get '*path', to: 'top#index'
end
