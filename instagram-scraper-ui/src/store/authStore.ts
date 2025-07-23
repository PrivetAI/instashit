import { create } from 'zustand';
import { authApi } from '@/api/auth.api';
import { Session } from '@/api/types';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  checkSession: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,

  login: async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    if (response.success) {
      await useAuthStore.getState().checkSession();
    }
  },

  checkSession: async () => {
    try {
      const session = await authApi.getSession();
      set({ session, isLoading: false });
    } catch (error) {
      set({ session: null, isLoading: false });
    }
  },

  logout: () => {
    set({ session: null });
  },
}));