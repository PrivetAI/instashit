import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Stop,
  Refresh,
  Close,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';
import { JobProgress } from '@/components/Jobs/JobProgress';
import { VideoCard } from '@/components/Results/VideoCard';
import { CommentsList } from '@/components/Results/CommentsList';
import { AnalysisView } from '@/components/Results/AnalysisView';
import { LogsConsole } from '@/components/Common/LogsConsole';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { ErrorAlert } from '@/components/Common/ErrorAlert';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useStopJob } from '@/hooks/useJobs';
import { Video, Log } from '@/api/types';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [realtimeLogs, setRealtimeLogs] = useState<Log[]>([]);
  const stopJob = useStopJob();

  const jobId = Number(id);

  const { data: job, isLoading, error, refetch } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(jobId),
    refetchInterval: (data) => {
      // Refetch every 2 seconds if job is in progress
      return data?.status === 'in_progress' ? 2000 : false;
    },
  });

  // WebSocket connection for real-time logs
  useWebSocket({
    jobId,
    onLog: (log) => {
      setRealtimeLogs((prev) => [...prev, {
        id: Date.now(),
        jobId,
        level: log.level as any,
        message: log.message,
        timestamp: log.timestamp,
      }]);
    },
    onProgress: (progress) => {
      // Progress is already updated via refetch
      console.log('Progress:', progress);
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStopJob = async () => {
    await stopJob.mutateAsync(jobId);
    refetch();
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoDialog = () => {
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner message="Loading job details..." />
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container>
        <ErrorAlert 
          error={error || 'Job not found'} 
          onRetry={() => navigate('/dashboard')} 
        />
      </Container>
    );
  }

  const relevantVideos = job.videos?.filter(v => v.isRelevant) || [];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Job #{job.id}: {job.queryType === 'hashtag' ? '#' : ''}{job.query}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          {job.status === 'in_progress' && (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={handleStopJob}
            >
              Stop Job
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <JobProgress job={job} />
        </Grid>

        {/* Content Tabs */}
        <Grid item xs={12}>
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Videos (${job.videos?.length || 0})`} />
              <Tab label="Analysis" />
              <Tab label="Logs" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Videos Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  {job.videos?.map((video) => (
                    <Grid item xs={12} md={6} lg={4} key={video.id}>
                      <VideoCard
                        video={video}
                        onViewComments={() => handleVideoSelect(video)}
                      />
                    </Grid>
                  ))}
                  {job.videos?.length === 0 && (
                    <Grid item xs={12}>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        align="center"
                      >
                        No videos processed yet
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Analysis Tab */}
              {tabValue === 1 && (
                <AnalysisView videos={job.videos || []} />
              )}

              {/* Logs Tab */}
              {tabValue === 2 && (
                <LogsConsole 
                  logs={job.logs || []} 
                  realTimeLogs={realtimeLogs}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Video Comments Dialog */}
      <Dialog
        open={!!selectedVideo}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Comments for Reel #{selectedVideo?.igVideoId}
          </Typography>
          <IconButton onClick={handleCloseVideoDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedVideo && (
            <CommentsList comments={selectedVideo.comments || []} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default JobDetails;