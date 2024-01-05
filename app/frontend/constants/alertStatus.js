// 処理の成功やエラーの表示をユーザーに知らせるアラートのためのステータス

export const successRegisterAlertStatus = {
  alertType: "success",
  alertTextArray: ["ユーザーの登録が完了しました"],
  isTransition: true
};

export const failRegisterAlertStatus = {
  alertType: "error",
  alertTextArray: [],
  isTransition: false
};

export const successLoginAlertStatus = {
  alertType: "success",
  alertTextArray: ["ログインに成功しました"],
  isTransition: true
};

export const failLoginAlertStatus = {
  alertType: "error",
  alertTextArray: ["メールアドレス・パスワードに誤りがあるか、登録されていません"],
  isTransition: false
};

export const successLogoutAlertStatus = {
  alertType: "success",
  alertTextArray: ["ログアウトしました"],
  isTransition: true
};

export const requireLoginAlertStatus = {
  alertType: "warning",
  alertTextArray: ["このページにアクセスするにはログインが必要です"],
  isTransition: true
};

export const notAuthorizedForDemoAlertStatus = {
  alertType: "warning",
  alertTextArray: ["この機能はお試しログインでは使えません"],
  isTransition: false
};

export const successFeedBackAlertStatus = {
  alertType: "success",
  alertTextArray: ["お問い合わせの送信が完了しました"],
  isTransition: false
};

export const serverErrorAlertStatus = {
  alertType: "error",
  alertTextArray: ["エラーが発生しました  時間を置いてもう一度お試しください"],
  isTransition: false
};