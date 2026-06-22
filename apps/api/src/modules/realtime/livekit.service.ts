import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

/**
 * Issues short-lived, access-scoped LiveKit tokens. The backend decides
 * publish/subscribe grants — the client never mints its own token.
 */
@Injectable()
export class LivekitService {
  constructor(private readonly config: ConfigService) {}

  get url(): string {
    return this.config.get<string>('LIVEKIT_URL', 'ws://localhost:7880');
  }

  async createToken(params: {
    roomName: string;
    identity: string;
    name?: string;
    canPublish: boolean;
  }): Promise<string> {
    const token = new AccessToken(
      this.config.get<string>('LIVEKIT_API_KEY', 'devkey'),
      this.config.get<string>('LIVEKIT_API_SECRET', 'devsecret'),
      { identity: params.identity, name: params.name, ttl: '1h' },
    );
    token.addGrant({
      room: params.roomName,
      roomJoin: true,
      canPublish: params.canPublish,
      canSubscribe: true,
      canPublishData: true,
    });
    return token.toJwt();
  }
}
