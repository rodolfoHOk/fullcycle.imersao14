import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { RoutesDriverDto } from './dto/routes-driver.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';

@Injectable()
export class RoutesDriverService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('kafka-producer') private kafkaProducerQueue: Queue,
  ) {}

  async createOrUpdate(dto: RoutesDriverDto) {
    const countRouteDriver = await this.prismaService.routeDriver.count({
      where: {
        route_id: dto.route_id,
      },
    });

    const routeDriver = await this.prismaService.routeDriver.upsert({
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

    if (countRouteDriver === 0) {
      await this.kafkaProducerQueue.add({
        event: 'RouteStarted',
        id: routeDriver.route.id,
        name: routeDriver.route.name,
        started_at: new Date().toISOString(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }

    const directions: DirectionsResponseData = JSON.parse(
      routeDriver.route.directions as string,
    );

    const lastPoint =
      directions.routes[0].legs[0].steps[
        directions.routes[0].legs[0].steps.length - 1
      ];

    if (
      lastPoint.end_location.lat === dto.lat &&
      lastPoint.end_location.lng === dto.lng
    ) {
      await this.kafkaProducerQueue.add({
        event: 'RouteFinished',
        id: routeDriver.route.id,
        name: routeDriver.route.name,
        finished_at: new Date().toISOString(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }

    await this.kafkaProducerQueue.add({
      event: 'DriverMoved',
      id: routeDriver.route.id,
      name: routeDriver.route.name,
      lat: dto.lat,
      lng: dto.lng,
    });

    return routeDriver;
  }
}
