import axios from 'axios';

export const TOKEN_KEY = 'jobtrackr_token';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
