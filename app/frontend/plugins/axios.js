import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'api'
});

// ユーザーログインに使われるトークンをヘッダーに含めるためのコード
if (localStorage.auth_token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.auth_token}`;
}

export default axiosInstance;