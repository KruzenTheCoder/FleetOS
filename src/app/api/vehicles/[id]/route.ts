import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapVehicle } from '@/lib/serializers';

type Params = { params: { id: string } };

function buildVehicleUpdate(payload: any) {
  const data: Record<string, unknown> = {};
  if (payload.driver !== undefined) data.driver = payload.driver;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.fuel !== undefined) data.fuel = payload.fuel;
  if (payload.speed !== undefined) data.speed = payload.speed;
  if (payload.odo !== undefined) data.odo = payload.odo;
  if (payload.cargo !== undefined) data.cargo = payload.cargo ?? null;
  if (payload.routeId !== undefined) data.routeId = payload.routeId ?? null;
  if (payload.i !== undefined) data.indexOnRoute = payload.i ?? null;
  if (payload.pos) {
    if (typeof payload.pos.lat !== 'number' || typeof payload.pos.lng !== 'number') {
      throw new Error('Invalid position payload');
    }
    data.posLat = payload.pos.lat;
    data.posLng = payload.pos.lng;
  }
  return data;
}

export async function PATCH(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Vehicle id is required' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updateData = buildVehicleUpdate(payload?.vehicle ?? payload);
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.vehicle.update({ where: { id }, data: updateData });
    return NextResponse.json(mapVehicle(updated));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    console.error('[vehicles.patch]', error);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Vehicle id is required' }, { status: 400 });
  }

  try {
    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    console.error('[vehicles.delete]', error);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}