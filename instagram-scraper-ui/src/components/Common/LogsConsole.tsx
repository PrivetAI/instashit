import { useEffect, useRef, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Clear, Search, Download } from '@mui/icons-material';
import { format } from 'date-fns';
import { Log } from '@/api/types';

interface LogsConsoleProps {
  logs: Log[];
  realTimeLogs?: Log[];
}

export const LogsConsole = ({ logs, realTimeLogs = [] }: LogsConsoleProps) => {
  const [filter, setFilter] = useState('');
  const [allLogs, setAllLogs] = useState<Log[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Combine initial logs with real-time logs
    const combined = [...logs, ...realTimeLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setAllLogs(combined);
  }, [logs, realTimeLogs]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [allLogs]);

  const filteredLogs = allLogs.filter(log =>
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  const handleClear = () => {
    setAllLogs([]);
  };

  const handleDownload = () => {
    const content = filteredLogs
      .map(log => `[${format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Console Logs
        </Typography>
        
        <TextField
          size="small"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />
        
        <Tooltip title="Download logs">
          <IconButton onClick={handleDownload} size="small">
            <Download />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Clear logs">
          <IconButton onClick={handleClear} size="small">
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Console */}
      <Box
        ref={consoleRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: '#1e1e1e',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
      >
        {filteredLogs.map((log, index) => (
          <Box key={index} sx={{ mb: 0.5 }}>
            <span style={{ color: '#666' }}>
              [{format(new Date(log.timestamp), 'HH:mm:ss')}]
            </span>
            {' '}
            <span className={`log-${log.level}`}>
              [{log.level.toUpperCase()}]
            </span>
            {' '}
            <span style={{ color: '#fff' }}>{log.message}</span>
          </Box>
        ))}
        
        {filteredLogs.length === 0 && (
          <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
            No logs to display
          </Typography>
        )}
      </Box>
    </Paper>
  );
};