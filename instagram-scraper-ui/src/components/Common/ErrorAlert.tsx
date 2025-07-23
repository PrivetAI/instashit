import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorAlertProps {
  error: Error | string;
  onRetry?: () => void;
}

export const ErrorAlert = ({ error, onRetry }: ErrorAlertProps) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};