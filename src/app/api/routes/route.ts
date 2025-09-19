import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapRoute, serializeRouteInput } from '@/lib/serializers';

export async function GET() {
  try {
    const routes = await prisma.route.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(routes.map(mapRoute));
  } catch (error) {
    console.error('[routes.get]', error);
    return NextResponse.json({ error: 'Failed to load routes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const route = payload?.route ?? payload;
    if (!route?.id || !route?.name || !Array.isArray(route?.points)) {
      return NextResponse.json({ error: 'Route id, name and points are required.' }, { status: 400 });
    }

    const data = serializeRouteInput(route);
    const created = await prisma.route.create({ data });
    return NextResponse.json(mapRoute(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Route with this id already exists.' }, { status: 409 });
    }
    console.error('[routes.post]', error);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}