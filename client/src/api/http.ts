import axios from 'axios';

export const TOKEN_KEY = 'jobtrackr_token';

const configuredBase =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.PROD ? 'https://jobtracer-pro.onrender.com/api' : 'http://localhost:5000/api');

const normalizeApiBase = (value: string) => {
  const trimmed = value.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const apiBase = normalizeApiBase(configuredBase);

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
