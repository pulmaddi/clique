import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

/**
 * In-room chat, reactions ("offerings"), presence and raise-hand.
 * Media itself flows through LiveKit; this gateway carries lightweight signals.
 */
@WebSocketGateway({ cors: { origin: true }, namespace: '/live' })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {
    // TODO: verify JWT from handshake auth before allowing room joins.
    void client;
  }

  handleDisconnect(client: Socket) {
    void client;
  }

  @SubscribeMessage('room:join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomName: string },
  ) {
    void client.join(data.roomName);
    this.server.to(data.roomName).emit('presence:update', { type: 'join' });
  }

  @SubscribeMessage('chat:message')
  onChat(
    @MessageBody()
    data: { roomName: string; userId: string; text: string },
  ) {
    this.server.to(data.roomName).emit('chat:message', data);
  }

  @SubscribeMessage('reaction:send')
  onReaction(
    @MessageBody()
    data: { roomName: string; userId: string; reaction: string },
  ) {
    // e.g. flower 🌸, diya 🪔, pranam 🙏
    this.server.to(data.roomName).emit('reaction:send', data);
  }

  @SubscribeMessage('hand:raise')
  onRaiseHand(
    @MessageBody() data: { roomName: string; userId: string; raised: boolean },
  ) {
    this.server.to(data.roomName).emit('hand:raise', data);
  }
}
