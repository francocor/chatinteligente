import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      client.data.tenantId = payload.tenantId;

      // Join tenant room
      client.join(`tenant:${payload.tenantId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    return { status: 'ok' };
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { status: 'ok' };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; text: string },
  ) {
    const message = await this.chatService.sendMessage(
      client.data.tenantId,
      data.conversationId,
      data.text,
      client.data.user.sub,
    );

    // Broadcast to conversation room
    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('new_message', message);

    return { status: 'ok', message };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('typing', {
      userId: client.data.user.sub,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('agent_status')
  async handleAgentStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { status: string },
  ) {
    await this.chatService.updateAgentStatus(
      client.data.tenantId,
      client.data.user.sub,
      data.status,
    );

    // Broadcast to tenant
    this.server
      .to(`tenant:${client.data.tenantId}`)
      .emit('agent_status_changed', {
        agentId: client.data.user.sub,
        status: data.status,
      });

    return { status: 'ok' };
  }
}