module LoginMacros
  def login_as(user)
    visit '/login'
    within "#login-form" do
      find("input[name='メールアドレス']", visible: :all).set(user.email)
      find("input[name='パスワード']", visible: :all).set("password")
      click_on "ログイン"
    end
  end
end
