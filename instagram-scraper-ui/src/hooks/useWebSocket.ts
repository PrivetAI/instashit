import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketLog } from '@/api/types';

interface UseWebSocketOptions {
  jobId: number;
  onLog?: (log: WebSocketLog) => void;
  onProgress?: (progress: number) => void;
}

export const useWebSocket = ({ jobId, onLog, onProgress }: UseWebSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('/', {
      query: { jobId: jobId.toString() },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('log', (log: WebSocketLog) => {
      onLog?.(log);
    });

    socket.on('progress', (progress: number) => {
      onProgress?.(progress);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [jobId, onLog, onProgress]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return { disconnect };
};