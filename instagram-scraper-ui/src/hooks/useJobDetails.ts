import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';

export const useJobDetails = (id: number) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getById(id),
    refetchInterval: (data) => {
      // Auto-refetch while job is running
      return data?.status === 'in_progress' ? 2000 : false;
    },
  });
};