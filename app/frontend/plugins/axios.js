import axios from 'axios';
import humps from 'humps';

const axiosInstance = axios.create({
  baseURL: 'api'
});

// ユーザーログインに使われるトークンをヘッダーに含めるためのコード
if (localStorage.auth_token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.auth_token}`;
}

// リクエストのデータの各Keyをスネークケース化
axiosInstance.interceptors.request.use((req) => {
  req.data = humps.decamelizeKeys(req.data);
  return req;
});

// レスポンスのデータの各Keyをキャメルケース化
axiosInstance.interceptors.response.use((res) => {
  res.data = humps.camelizeKeys(res.data);
  return res;
});

export default axiosInstance;