import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapVehicle, serializeVehicleInput } from '@/lib/serializers';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(vehicles.map(mapVehicle));
  } catch (error) {
    console.error('[vehicles.get]', error);
    return NextResponse.json({ error: 'Failed to load vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const vehicle = payload?.vehicle ?? payload;

    if (!vehicle?.id || !vehicle?.driver || !vehicle?.status || !vehicle?.pos) {
      return NextResponse.json({ error: 'Vehicle id, driver, status and position are required.' }, { status: 400 });
    }

    const data = serializeVehicleInput(vehicle);
    const created = await prisma.vehicle.create({ data });
    return NextResponse.json(mapVehicle(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Vehicle with this id already exists.' }, { status: 409 });
    }
    console.error('[vehicles.post]', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}