require 'rails_helper'

RSpec.describe "ユーザー機能", type: :system do
  let(:user) { create(:user) }

  describe "ログインしているかどうかによる表示の切り替え" do
    it "未ログイン状態でヘッダーに「ログイン」、「新規登録」のリンクが表示されている" do
      visit root_path
      within("header") do
        expect(page).to have_link("ログイン"), "未ログイン状態でヘッダーに「ログイン」のリンクが表示されていません"
        expect(page).to have_link("新規登録"), "未ログイン状態でヘッダーに「新規登録」のリンクが表示されていません"
      end
    end

    it "ログイン状態でヘッダーの「ログアウト」のボタンからログアウトできる" do
      login_as(user)
      within("header") do
        expect(page).to have_button("ログアウト"), "ログイン状態でヘッダーに「ログアウト」のボタンが表示されていません"
        click_on("ログアウト")
      end
      expect(page).to have_content("ログアウトしました"), "ログアウト成功のアラートが表示されていません"
      expect(page).to have_current_path('/'), "トップページに遷移できていません"
    end
  end

  describe "ユーザー登録" do
    before do
      visit root_path
      within("header") do
        click_link("新規登録")
      end
    end

    it "ユーザー登録フォームの各フィールドを入力して登録ができると同時に、ログインされること" do
      within("#register-form") do
        find("input[name='ユーザー名']", visible: :all).set("test")
        find("input[name='メールアドレス']", visible: :all).set("test@example.com")
        find("input[name='パスワード']", visible: :all).set("password")
        find("input[name='パスワード（確認）']", visible: :all).set("password")
        click_on("登録")
      end
      expect(page).to have_content("ユーザーの登録が完了しました"), "ユーザー登録成功のアラートが表示されていません"
      expect(page).to have_button("ログアウト"), "ユーザー登録後に、ログインされていません"
      expect(page).to have_current_path('/'), "ユーザー登録後に、トップページに遷移できていません"
    end

    it "ユーザー登録フォームの各フィールドのバリデーションが機能していること" do
      within("#register-form") do
        find("input[name='ユーザー名']", visible: :all).set("")
        expect(page).to have_content("ユーザー名は必須項目です"), "必須チェックのバリデーションエラーが表示されていません"
        find("input[name='ユーザー名']", visible: :all).set("a" * 21)
        expect(page).to have_content("20文字以内で入力してください"), "最大文字数のバリデーションエラーが表示されていません"
        find("input[name='メールアドレス']", visible: :all).set("")
        expect(page).to have_content("メールアドレスは必須項目です"), "必須チェックのバリデーションエラーが表示されていません"
        find("input[name='メールアドレス']", visible: :all).set("error")
        expect(page).to have_content("メールアドレスの形式が正しくありません"), "メールアドレス形式のバリデーションエラーが表示されていません"
        find("input[name='パスワード']", visible: :all).set("")
        expect(page).to have_content("パスワードは必須項目です"), "必須チェックのバリデーションエラーが表示されていません"
        find("input[name='パスワード']", visible: :all).set("a" * 2)
        expect(page).to have_content("3文字以上で入力してください"), "最低文字数のバリデーションエラーが表示されていません"
        find("input[name='パスワード']", visible: :all).set("password")
        find("input[name='パスワード（確認）']", visible: :all).set("error")
        expect(page).to have_content("パスワードと一致していません"), "パスワード一致のバリデーションエラーが表示されていません"
        click_on("登録")
      end
      expect(page).to have_current_path('/register'), "バリデーションエラー発生時に、ページ遷移されています"
    end

    it "登録済みのメールアドレスでユーザー登録ができないこと" do
      within("#register-form") do
        find("input[name='ユーザー名']", visible: :all).set("test")
        find("input[name='メールアドレス']", visible: :all).set(user.email)
        find("input[name='パスワード']", visible: :all).set("password")
        find("input[name='パスワード（確認）']", visible: :all).set("password")
        click_on("登録")
      end
      expect(page).to have_content("このメールアドレスはすでに使われています"), "ユーザー登録失敗のアラートが表示されていません"
      expect(page).to have_current_path('/register'), "バリデーションエラー発生時に、ページ遷移されています"
    end
  end

  describe "ユーザーログイン" do
    before do
      visit root_path
      within("header") do
        click_link("ログイン")
      end
    end

    it "登録済みのユーザーでログインできること" do
      within("#login-form") do
        find("input[name='メールアドレス']", visible: :all).set(user.email)
        find("input[name='パスワード']", visible: :all).set("password")
        click_on("ログイン")
      end
      expect(page).to have_content("ログインに成功しました"), "ログイン成功のアラートが表示されていません"
      expect(page).to have_current_path('/'), "ログイン後に、トップページに遷移できていません"
    end

    it "登録していないメールアドレスでログインできないこと" do
      within("#login-form") do
        find("input[name='メールアドレス']", visible: :all).set("error@example.com")
        find("input[name='パスワード']", visible: :all).set("password")
        click_on("ログイン")
      end
      expect(page).to have_content("メールアドレス・パスワードに誤りがあるか、登録されていません"), "ログイン失敗のアラートが表示されていません"
      expect(page).to have_current_path('/login'), "バリデーションエラー発生時に、ページ遷移されています"
    end

    it "パスワードが間違っている場合にログインできないこと" do
      within("#login-form") do
        find("input[name='メールアドレス']", visible: :all).set(user.email)
        find("input[name='パスワード']", visible: :all).set("error")
        click_on("ログイン")
      end
      expect(page).to have_content("メールアドレス・パスワードに誤りがあるか、登録されていません"), "ログイン失敗のアラートが表示されていません"
      expect(page).to have_current_path('/login'), "バリデーションエラー発生時に、ページ遷移されています"
    end

    it "ユーザーログインフォームの各フィールドのバリデーションが機能していること" do
      within("#login-form") do
        find("input[name='メールアドレス']", visible: :all).set("")
        expect(page).to have_content("メールアドレスは必須項目です"), "必須チェックのバリデーションエラーが表示されていません"
        find("input[name='メールアドレス']", visible: :all).set("test")
        expect(page).to have_content("メールアドレスの形式が正しくありません"), "メールアドレス形式のバリデーションエラーが表示されていません"
        find("input[name='パスワード']", visible: :all).set("")
        expect(page).to have_content("パスワードは必須項目です"), "必須チェックのバリデーションエラーが表示されていません"
        find("input[name='パスワード']", visible: :all).set("a" * 2)
        expect(page).to have_content("3文字以上で入力してください"), "最低文字数のバリデーションエラーが表示されていません"
        click_on("ログイン")
      end
      expect(page).to have_current_path('/login'), "バリデーションエラー発生時に、ページ遷移されています"
    end
  end
end
