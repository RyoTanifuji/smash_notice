FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "example-#{n}@example.com" }
    password { 'password' }
    password_confirmation { 'password' }
    sequence(:name) { |n| "test-#{n}" }
  end
end
