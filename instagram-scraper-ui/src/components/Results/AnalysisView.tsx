import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Video } from '@/api/types';

interface AnalysisViewProps {
  videos: Video[];
}

export const AnalysisView = ({ videos }: AnalysisViewProps) => {
  // Calculate statistics
  const stats = {
    totalVideos: videos.length,
    relevantVideos: videos.filter(v => v.isRelevant).length,
    commentedVideos: videos.filter(v => v.commented).length,
    totalComments: videos.reduce((acc, v) => acc + (v.comments?.length || 0), 0),
  };

  const toneDistribution = videos
    .flatMap(v => v.comments || [])
    .filter(c => c.analysis)
    .reduce((acc, comment) => {
      const tone = comment.analysis!.tone;
      acc[tone] = (acc[tone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(toneDistribution).map(([tone, count]) => ({
    name: tone,
    value: count,
  }));

  const COLORS = {
    professional: '#2196F3',
    casual: '#4CAF50',
    motivational: '#FF9800',
  };

  return (
    <Grid container spacing={3}>
      {/* Statistics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalVideos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Videos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.relevantVideos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Relevant Videos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {stats.commentedVideos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commented
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">
                {stats.totalComments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Comments
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Tone Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comment Tone Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Success Rate */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Success Metrics
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Relevance Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(stats.relevantVideos / stats.totalVideos) * 100}%`,
                        height: '100%',
                        bgcolor: 'success.main',
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {((stats.relevantVideos / stats.totalVideos) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Comment Success Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(stats.commentedVideos / stats.relevantVideos) * 100}%`,
                        height: '100%',
                        bgcolor: 'info.main',
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {((stats.commentedVideos / stats.relevantVideos) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};