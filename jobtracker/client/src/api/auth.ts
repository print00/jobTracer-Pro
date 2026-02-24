import { http, TOKEN_KEY } from './http';
import type { AuthResponse, User } from '../types';

export const registerUser = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await http.post<AuthResponse>('/auth/register', payload);
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const { data } = await http.post<AuthResponse>('/auth/login', payload);
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
};

export const logoutUser = async () => {
  await http.post('/auth/logout');
  localStorage.removeItem(TOKEN_KEY);
};

export const fetchMe = async () => {
  const { data } = await http.get<{ user: User }>('/auth/me');
  return data.user;
};
