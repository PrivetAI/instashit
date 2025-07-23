import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Grid,
} from '@mui/material';
import { Tag, Search, PlayArrow } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateJob } from '@/hooks/useJobs';
import { CreateJobRequest } from '@/api/types';

const schema = z.object({
  query: z.string().min(1, 'Query is required'),
  queryType: z.enum(['hashtag', 'keyword']),
  videoLimit: z.number().min(1).max(50),
  commentLimit: z.number().min(1).max(20),
});

export const JobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createJob = useCreateJob();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateJobRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: '',
      queryType: 'hashtag',
      videoLimit: 10,
      commentLimit: 10,
    },
  });

  const queryType = watch('queryType');

  const onSubmit = async (data: CreateJobRequest) => {
    setIsSubmitting(true);
    try {
      // Remove # if present for hashtags
      if (data.queryType === 'hashtag') {
        data.query = data.query.replace('#', '');
      }
      await createJob.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Scraping Job
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Query Type */}
            <Grid item xs={12}>
              <Controller
                name="queryType"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="hashtag">
                      <Tag sx={{ mr: 1 }} />
                      Hashtag
                    </ToggleButton>
                    <ToggleButton value="keyword">
                      <Search sx={{ mr: 1 }} />
                      Keyword
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>

            {/* Query Input */}
            <Grid item xs={12}>
              <Controller
                name="query"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={queryType === 'hashtag' ? 'Hashtag' : 'Search Keyword'}
                    placeholder={queryType === 'hashtag' ? 'jobsearch' : 'remote work'}
                    error={!!errors.query}
                    helperText={errors.query?.message}
                    InputProps={{
                      startAdornment: queryType === 'hashtag' ? '#' : null,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Video Limit */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Videos to analyze: {watch('videoLimit')}
              </Typography>
              <Controller
                name="videoLimit"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={1}
                    max={50}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                )}
              />
            </Grid>

            {/* Comment Limit */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Comments per video: {watch('commentLimit')}
              </Typography>
              <Controller
                name="commentLimit"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={1}
                    max={20}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayArrow />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Starting...' : 'Start Scraping'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};