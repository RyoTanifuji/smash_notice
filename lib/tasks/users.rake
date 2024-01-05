namespace :users do
  desc "デモユーザーの削除"
  task delete_demo_users: :environment do
    begin
      User.transaction do
        User.demo.each do |user|
          user.destroy!
        end
      end
    rescue => e
      puts e
      puts "Something went wrong."
    else
      puts "All demo users have been successfully deleted."
    end
  end
end
