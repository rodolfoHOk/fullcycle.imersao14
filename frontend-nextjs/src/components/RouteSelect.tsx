'use client';

import { NativeSelect, NativeSelectProps } from '@mui/material';
import useSwr from 'swr';
import { fetcher } from '@/utils/http';
import { Route } from '@/utils/models';

type RouteSelectProps = NativeSelectProps & {
  onChange?: (place_id: string) => void;
};

export const RouteSelect = (props: RouteSelectProps) => {
  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>('http://localhost:3000/routes', fetcher, {
    fallbackData: [],
  });

  return (
    <NativeSelect
      {...props}
      onChange={(event) => props.onChange && props.onChange(event.target.value)}
    >
      {isLoading && <option>Carregando rotas...</option>}

      {routes && (
        <>
          <option value="">Selecione uma rota</option>

          {routes!.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </>
      )}
    </NativeSelect>
  );
};
