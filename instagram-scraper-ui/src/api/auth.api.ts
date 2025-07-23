import { apiClient } from './client';
import { LoginRequest, LoginResponse, Session } from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getSession: async (): Promise<Session> => {
    const response = await apiClient.get('/auth/session');
    return response.data;
  },
};