import axios from 'axios';

export const TOKEN_KEY = 'jobtrackr_token';

const apiBase =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE ??
  'http://localhost:5000/api';

export const http = axios.create({
  baseURL: apiBase,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
