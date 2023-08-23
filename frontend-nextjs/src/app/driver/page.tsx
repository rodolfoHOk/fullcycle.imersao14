'use client';

import { useEffect, useRef } from 'react';
import useSwr from 'swr';
import { useMap } from '@/hooks/useMap';
import { fetcher } from '@/utils/http';
import { Route } from '@/utils/models';
import { socket } from '@/utils/socket-io';

type SocketPayload = {
  route_id: string;
  lat: number;
  lng: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function DrivePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>('http://localhost:3000/routes', fetcher, {
    fallbackData: [],
  });

  async function startRoute() {
    const routeId = (document.getElementById('route') as HTMLSelectElement)
      .value;

    const response = await fetch(`http://localhost:3000/routes/${routeId}`);
    const route: Route = await response.json();

    map?.removeAllRoutes();
    await map?.addRouteWithIcons({
      routeId: routeId,
      startMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: route.directions.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
    });

    const { steps } = route.directions.routes[0].legs[0];

    for (const step of steps) {
      await sleep(2000);
      map?.moveCar(routeId, step.start_location);
      const startPayload: SocketPayload = {
        route_id: routeId,
        lat: step.start_location.lat,
        lng: step.start_location.lng,
      };
      socket.emit('new-points', startPayload);

      await sleep(2000);
      map?.moveCar(routeId, step.end_location);
      const endPayload: SocketPayload = {
        route_id: routeId,
        lat: step.end_location.lat,
        lng: step.end_location.lng,
      };
      socket.emit('new-points', endPayload);
    }
  }

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
      }}
    >
      <div>
        <h1>Minha viagem</h1>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select id="route">
            {isLoading && <option>Carregando rotas...</option>}

            {routes!.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>

          <button type="submit" onClick={startRoute}>
            Iniciar a viagem
          </button>
        </div>
      </div>

      <div
        id="map"
        style={{
          height: '100%',
          width: '100%',
        }}
        ref={mapContainerRef}
      ></div>
    </div>
  );
}

export default DrivePage;
