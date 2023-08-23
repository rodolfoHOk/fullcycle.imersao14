import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text');

  const response = await fetch(
    `http://host.docker.internal:3000/places?text=${text}`,
    {
      next: {
        revalidate: 1, // produção mudar para um valor bem grande
      },
    }
  );

  return NextResponse.json(await response.json());
}
