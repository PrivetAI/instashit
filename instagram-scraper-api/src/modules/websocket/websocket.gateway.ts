import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private jobRooms = new Map<number, Set<string>>();

  handleConnection(client: Socket) {
    const jobId = client.handshake.query.jobId as string;
    if (jobId) {
      client.join(`job-${jobId}`);
      
      if (!this.jobRooms.has(Number(jobId))) {
        this.jobRooms.set(Number(jobId), new Set());
      }
      this.jobRooms.get(Number(jobId)).add(client.id);
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup
    this.jobRooms.forEach((clients, jobId) => {
      clients.delete(client.id);
    });
  }

  sendLog(jobId: number, log: any) {
    this.server.to(`job-${jobId}`).emit('log', log);
  }

  sendProgress(jobId: number, progress: number) {
    this.server.to(`job-${jobId}`).emit('progress', progress);
  }
}