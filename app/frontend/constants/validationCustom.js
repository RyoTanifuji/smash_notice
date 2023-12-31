import { helpers } from '@vuelidate/validators';

export const image = (value) => {
  const pattern = /^data:image\/(jpeg|jpg|png);base64,/;
  return pattern.test(value) || !helpers.req(value);
};

// バリデーションのエラーメッセージ
export const requiredMessage = (value) => `${value}は必須項目です`;

export const emailMessage = () => "メールアドレスの形式が正しくありません";

export const minLengthMessage = (length) => `${length}文字以上で入力してください`;

export const maxLengthMessage = (length) => `${length}文字以内で入力してください`;

export const sameAsMessage = (ref) => `${ref}と一致していません`;