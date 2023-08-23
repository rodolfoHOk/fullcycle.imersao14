import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
// import { RoutesDriverService } from '../routes-driver/routes-driver.service';
import { RoutesDriverDto } from '../routes-driver/dto/routes-driver.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@WebSocketGateway({ cors: { origin: '*' } })
export class RoutesGateway {
  constructor(@InjectQueue('new-points') private newPointsQueue: Queue) {}

  @SubscribeMessage('new-points')
  async handleMessage(client: Socket, payload: RoutesDriverDto) {
    client.broadcast.emit('admin-new-points', payload);
    client.broadcast.emit(`new-points${payload.route_id}`, payload);

    await this.newPointsQueue.add(payload);
  }
}
