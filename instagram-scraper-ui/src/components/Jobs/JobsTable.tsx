import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
  Box,
  Typography,
} from '@mui/material';
import { Visibility, Stop } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/api/types';
import { useStopJob } from '@/hooks/useJobs';

interface JobsTableProps {
  jobs: Job[];
}

export const JobsTable = ({ jobs }: JobsTableProps) => {
  const navigate = useNavigate();
  const stopJob = useStopJob();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'failed':
        return 'error';
      case 'stopped':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleStop = (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    stopJob.mutate(jobId);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Query</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <TableCell>{job.id}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {job.queryType === 'hashtag' ? '#' : ''}{job.query}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={job.queryType}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={job.status.replace('_', ' ')}
                  size="small"
                  color={getStatusColor(job.status)}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={job.progress}
                    sx={{ width: 100, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption">{job.progress}%</Typography>
                </Box>
              </TableCell>
              <TableCell>
                {format(new Date(job.createdAt), 'MMM dd, HH:mm')}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                  {job.status === 'in_progress' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => handleStop(e, job.id)}
                    >
                      <Stop />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};