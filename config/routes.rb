Rails.application.routes.draw do
  root 'top#index'
  namespace :api do
    resources :users, only: %i[create] do
      collection do
        get 'me'
        post 'create_demo'
      end
    end
    resources :sessions, only: %i[create]
    resources :folders, only: %i[index create update destroy] do
      resources :memos, only: %i[index create]
      get 'template', to: 'memos#template'
    end
    resources :memos, only: %i[show update destroy] do
      resources :memo_blocks, only: %i[create update destroy] do
        patch :swap_level
      end
    end
    resources :shared, only: %i[index show] do
      collection do
        get 'bookmarks'
      end
    end
    resource :bookmarks, only: %i[create destroy]
    resources :feedbacks, only: %i[create]
  end

  get '*path', to: 'top#index', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
