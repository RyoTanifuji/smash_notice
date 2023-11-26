Rails.application.routes.draw do
  root 'top#index'
  namespace :api do
    resources :users, only: %i[create] do
      collection do
        get 'me'
      end
    end
    resources :sessions, only: %i[create]
    resources :folders, only: %i[index create update destroy] do
      resources :memos, only: %i[index create]
    end
  end

  get '*path', to: 'top#index'
end
