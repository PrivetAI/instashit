import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { session, checkSession } = useAuthStore();

  useEffect(() => {
    if (!session) {
      checkSession();
    }
  }, [session, checkSession]);

  useEffect(() => {
    if (session && !session.active) {
      navigate('/login');
    }
  }, [session, navigate]);

  return { session };
};