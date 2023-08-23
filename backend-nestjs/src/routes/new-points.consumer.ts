import { Job } from 'bull';
import { RoutesDriverDto } from './routes-driver/dto/routes-driver.dto';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { Process, Processor } from '@nestjs/bull';

@Processor('new-points')
export class NewPointsConsumer {
  constructor(private routesDriverService: RoutesDriverService) {}

  @Process()
  async handle(job: Job<RoutesDriverDto>) {
    await this.routesDriverService.createOrUpdate(job.data);
    return {};
  }
}
