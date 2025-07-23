import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Link,
} from '@mui/material';
import { OpenInNew, Comment, CheckCircle } from '@mui/icons-material';
import { Video } from '@/api/types';

interface VideoCardProps {
  video: Video;
  onViewComments: () => void;
}

export const VideoCard = ({ video, onViewComments }: VideoCardProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            Reel #{video.igVideoId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {video.isRelevant && (
              <Chip label="Relevant" color="success" size="small" />
            )}
            {video.commented && (
              <Chip
                label="Commented"
                icon={<CheckCircle />}
                color="primary"
                size="small"
              />
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {video.description || 'No description'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Comments: {video.comments?.length || 0}
          </Typography>
          {video.commentedAt && (
            <Typography variant="caption" color="text.secondary">
              Commented at: {new Date(video.commentedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          startIcon={<Comment />}
          onClick={onViewComments}
        >
          View Comments
        </Button>
        <Link
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ ml: 'auto' }}
        >
          <Button size="small" endIcon={<OpenInNew />}>
            Open on Instagram
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};