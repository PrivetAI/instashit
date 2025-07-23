import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';
import { CreateJobRequest } from '@/api/types';
import toast from 'react-hot-toast';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
    refetchInterval: 5000, // Обновляем каждые 5 секунд
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) => jobsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created successfully');
    },
    onError: () => {
      toast.error('Failed to create job');
    },
  });
};

export const useStopJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => jobsApi.stop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job stopped');
    },
  });
};