import axios from 'axios';
import store from '../store';
import humps from 'humps';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// ユーザーログインに使われるトークンをヘッダーに含めるためのコード
if (localStorage.auth_token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.auth_token}`;
}

axiosInstance.interceptors.request.use((req) => {
  // axiosでリクエストを送るたびに、アラートを初期化
  if (req.method === "post" || req.method === "patch") store.dispatch("alert/closeAlert");

  // リクエストのデータの各Keyをスネークケース化
  req.data = humps.decamelizeKeys(req.data);
  return req;
});

axiosInstance.interceptors.response.use((res) => {
  // レスポンスのデータの各Keyをキャメルケース化
  res.data = humps.camelizeKeys(res.data);
  return res;
});

export default axiosInstance;