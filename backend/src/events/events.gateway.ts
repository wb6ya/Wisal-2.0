// src/events/events.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'; // حذفنا الباقي
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const tenantId = client.handshake.query.tenantId as string;

    if (tenantId) {
      void client.join(tenantId);
      console.log(`Client connected: ${client.id} joined room ${tenantId}`);
    } else {
      console.log(`Client connected without tenantId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitToTenant(tenantId: string, event: string, data: any) {
    this.server.to(tenantId).emit(event, data);
  }
}
