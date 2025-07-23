import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import { Person, AutoAwesome } from '@mui/icons-material';
import { Comment } from '@/api/types';
import { format } from 'date-fns';

interface CommentsListProps {
  comments: Comment[];
}

export const CommentsList = ({ comments }: CommentsListProps) => {
  return (
    <Paper sx={{ maxHeight: 600, overflow: 'auto' }}>
      <List>
        {comments.map((comment, index) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  {comment.isOurComment ? <AutoAwesome /> : <Person />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {comment.author}
                    </Typography>
                    {comment.isOurComment && (
                      <Chip
                        label="Our Comment"
                        size="small"
                        color="primary"
                        icon={<AutoAwesome />}
                      />
                    )}
                    {comment.analysis && (
                      <Chip
                        label={comment.analysis.tone}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', my: 1 }}
                    >
                      {comment.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.postedAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                    {comment.analysis?.generatedText && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="primary">
                          AI Generated Response:
                        </Typography>
                        <Typography variant="body2">
                          {comment.analysis.generatedText}
                        </Typography>
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < comments.length - 1 && <Divider component="li" />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};