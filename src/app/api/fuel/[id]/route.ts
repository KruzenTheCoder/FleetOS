import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapFuelTxn } from '@/lib/serializers';

type Params = { params: { id: string } };

function buildFuelUpdate(payload: any) {
  const data: Record<string, unknown> = {};
  if (payload.dt !== undefined) data.dt = new Date(payload.dt);
  if (payload.liters !== undefined) data.liters = payload.liters;
  if (payload.price !== undefined) data.price = payload.price;
  if (payload.total !== undefined) data.total = payload.total ?? null;
  if (payload.station !== undefined) data.station = payload.station ?? null;
  if (payload.odo !== undefined) data.odo = payload.odo ?? null;
  if (payload.vehicle !== undefined) data.vehicleId = payload.vehicle;
  return data;
}

export async function PATCH(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Transaction id is required' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updateData = buildFuelUpdate(payload?.transaction ?? payload);
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.fuelTxn.update({ where: { id }, data: updateData });
    return NextResponse.json(mapFuelTxn(updated));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Fuel transaction not found' }, { status: 404 });
    }
    console.error('[fuel.patch]', error);
    return NextResponse.json({ error: 'Failed to update fuel transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Transaction id is required' }, { status: 400 });
  }

  try {
    await prisma.fuelTxn.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Fuel transaction not found' }, { status: 404 });
    }
    console.error('[fuel.delete]', error);
    return NextResponse.json({ error: 'Failed to delete fuel transaction' }, { status: 500 });
  }
}