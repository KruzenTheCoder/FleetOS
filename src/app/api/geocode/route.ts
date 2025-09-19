import { NextResponse } from 'next/server';

const MAPBOX_ENDPOINT = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export async function GET(request: Request) {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    console.error('[geocode] Missing MAPBOX_TOKEN environment variable');
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  const url = `${MAPBOX_ENDPOINT}/${encodeURIComponent(query)}.json?limit=6&access_token=${token}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      // cache for a minute to avoid hammering the API when users type fast
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[geocode] Mapbox error', response.status, response.statusText);
      return NextResponse.json({ results: [] }, { status: response.status });
    }

    const data = (await response.json()) as {
      features?: Array<{
        id: string;
        place_name: string;
        center: [number, number];
      }>;
    };

    const results = (data.features ?? []).map((feature) => ({
      id: feature.id,
      name: feature.place_name,
      lng: feature.center[0],
      lat: feature.center[1],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[geocode] failed', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
