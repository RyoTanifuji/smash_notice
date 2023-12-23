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
      get 'template', to: 'memos#template'
    end
    resources :memos, only: %i[show update destroy] do
      resources :memo_blocks, only: %i[create update destroy]
    end
    resources :shared, only: %i[index show]
  end

  get '*path', to: 'top#index', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
