Rails.application.routes.draw do
  root 'top#index'

  get '*path', to: 'top#index'
end
