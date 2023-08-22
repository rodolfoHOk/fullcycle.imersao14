import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { RoutesDriverDto } from './dto/routes-driver.dto';

@Injectable()
export class RoutesDriverService {
  constructor(private prismaService: PrismaService) {}

  async createOrUpdate(dto: RoutesDriverDto) {
    return this.prismaService.routeDriver.upsert({
      where: {
        route_id: dto.route_id,
      },
      include: {
        route: true,
      },
      create: {
        route_id: dto.route_id,
        points: {
          set: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
      update: {
        points: {
          push: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
    });
  }
}
