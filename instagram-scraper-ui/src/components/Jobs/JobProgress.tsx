import { Box, LinearProgress, Typography, Card, CardContent } from '@mui/material';
import { Job } from '@/api/types';

interface JobProgressProps {
  job: Job;
}

export const JobProgress = ({ job }: JobProgressProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Job Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {job.status.replace('_', ' ')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            variant="determinate"
            value={job.progress}
            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="h6" color="primary">
            {job.progress}%
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Videos: {job.videos?.length || 0} / {job.videoLimit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Comments per video: {job.commentLimit}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};