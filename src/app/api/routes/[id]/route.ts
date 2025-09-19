import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapRoute } from '@/lib/serializers';

type Params = { params: { id: string } };

function buildRouteUpdate(payload: any) {
  const data: Record<string, unknown> = {};
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.color !== undefined) data.color = payload.color;
  if (payload.points !== undefined) {
    if (!Array.isArray(payload.points)) {
      throw new Error('Route points must be an array');
    }
    data.points = JSON.stringify(payload.points);
  }
  if (payload.waypoints !== undefined) {
    data.waypoints = payload.waypoints ? JSON.stringify(payload.waypoints) : null;
  }
  return data;
}

export async function PATCH(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Route id is required' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updateData = buildRouteUpdate(payload?.route ?? payload);
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.route.update({ where: { id }, data: updateData });
    return NextResponse.json(mapRoute(updated));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    console.error('[routes.patch]', error);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Route id is required' }, { status: 400 });
  }

  try {
    await prisma.route.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    console.error('[routes.delete]', error);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}