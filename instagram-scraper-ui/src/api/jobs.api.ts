import { apiClient } from './client';
import { CreateJobRequest, Job } from './types';

export const jobsApi = {
  create: async (data: CreateJobRequest): Promise<Job> => {
    const response = await apiClient.post('/jobs', data);
    return response.data;
  },

  getAll: async (): Promise<Job[]> => {
    const response = await apiClient.get('/jobs');
    return response.data;
  },

  getById: async (id: number): Promise<Job> => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  stop: async (id: number): Promise<void> => {
    await apiClient.put(`/jobs/${id}/stop`);
  },
};