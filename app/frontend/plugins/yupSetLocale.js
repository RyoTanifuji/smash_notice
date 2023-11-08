import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: (prm) => `${prm.label}は必須項目です`,
  },
  string: {
    min: "${min}文字以上で入力してください",
    email: "メールアドレスの形式ではありません"
  }
});