export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface Session {
  active: boolean;
  username?: string;
  lastUsed?: string;
}

export interface CreateJobRequest {
  query: string;
  queryType: 'hashtag' | 'keyword';
  videoLimit: number;
  commentLimit: number;
}

export interface Job {
  id: number;
  query: string;
  queryType: string;
  videoLimit: number;
  commentLimit: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'stopped';
  progress: number;
  stopped: boolean;
  createdAt: string;
  videos?: Video[];
  logs?: Log[];
}

export interface Video {
  id: number;
  jobId: number;
  igVideoId: string;
  url: string;
  description?: string;
  isRelevant?: boolean;
  commented: boolean;
  commentedAt?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  videoId: number;
  igCommentId: string;
  text: string;
  author: string;
  postedAt: string;
  isOurComment: boolean;
  analysis?: Analysis;
}

export interface Analysis {
  id: number;
  commentId: number;
  videoId: number;
  relevant: boolean;
  tone: string;
  generatedText?: string;
  analyzedAt: string;
}

export interface Log {
  id: number;
  jobId: number;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export interface WebSocketLog {
  level: string;
  message: string;
  timestamp: string;
}