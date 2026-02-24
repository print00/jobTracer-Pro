import { http } from './http';
import type { Application, StatsResponse, Stage } from '../types';

export interface AppPayload {
  company: string;
  roleTitle: string;
  location?: string;
  jobUrl?: string;
  stage: Stage;
  appliedDate?: string;
  followUpDate?: string;
  notes?: string;
}

export const fetchApps = async () => {
  const { data } = await http.get<{ items: Application[] }>('/apps');
  return data.items;
};

export const createApp = async (payload: AppPayload) => {
  const { data } = await http.post<{ item: Application }>('/apps', payload);
  return data.item;
};

export const updateApp = async (id: string, payload: Partial<AppPayload>) => {
  const { data } = await http.put<{ item: Application }>(`/apps/${id}`, payload);
  return data.item;
};

export const deleteApp = async (id: string) => {
  await http.delete(`/apps/${id}`);
};

export const fetchStats = async () => {
  const { data } = await http.get<StatsResponse>('/apps/stats');
  return data;
};

export const exportAppsCsv = async () => {
  const response = await http.get('/apps/export', { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'jobtrackr-applications.csv';
  link.click();
  URL.revokeObjectURL(blobUrl);
};
