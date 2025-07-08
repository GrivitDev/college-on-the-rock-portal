// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ No fallback to localhost
  withCredentials: false, // ✅ Token is passed via header
});

// ✅ Attach JWT token from sessionStorage to every request
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
