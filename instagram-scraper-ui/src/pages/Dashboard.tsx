import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { JobForm } from '@/components/Jobs/JobForm';
import { JobsTable } from '@/components/Jobs/JobsTable';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { ErrorAlert } from '@/components/Common/ErrorAlert';
import { useJobs } from '@/hooks/useJobs';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data: jobs, isLoading, error, refetch } = useJobs();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const activeJobs = jobs?.filter(job => 
    ['pending', 'in_progress'].includes(job.status)
  ) || [];
  
  const completedJobs = jobs?.filter(job => 
    ['completed', 'failed', 'stopped'].includes(job.status)
  ) || [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage your Instagram scraping jobs
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Create New Job */}
        <Grid item xs={12}>
          <JobForm />
        </Grid>

        {/* Jobs List */}
        <Grid item xs={12}>
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Active Jobs (${activeJobs.length})`} />
              <Tab label={`Completed Jobs (${completedJobs.length})`} />
              <Tab label={`All Jobs (${jobs?.length || 0})`} />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {isLoading ? (
                <LoadingSpinner message="Loading jobs..." />
              ) : error ? (
                <ErrorAlert error={error} onRetry={refetch} />
              ) : (
                <>
                  {tabValue === 0 && (
                    <JobsTable jobs={activeJobs} />
                  )}
                  {tabValue === 1 && (
                    <JobsTable jobs={completedJobs} />
                  )}
                  {tabValue === 2 && (
                    <JobsTable jobs={jobs || []} />
                  )}
                </>
              )}

              {!isLoading && !error && (
                (tabValue === 0 && activeJobs.length === 0) ||
                (tabValue === 1 && completedJobs.length === 0) ||
                (tabValue === 2 && (jobs?.length || 0) === 0)
              ) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No jobs found
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;