import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapFuelTxn, serializeFuelTxnInput } from '@/lib/serializers';

export async function GET() {
  try {
    const txns = await prisma.fuelTxn.findMany({ orderBy: { dt: 'desc' } });
    return NextResponse.json(txns.map(mapFuelTxn));
  } catch (error) {
    console.error('[fuel.get]', error);
    return NextResponse.json({ error: 'Failed to load fuel transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const txn = payload?.transaction ?? payload;
    if (!txn?.id || !txn?.vehicle || !txn?.dt) {
      return NextResponse.json({ error: 'Transaction id, vehicle and datetime are required.' }, { status: 400 });
    }

    const data = serializeFuelTxnInput(txn);
    const created = await prisma.fuelTxn.create({ data });
    return NextResponse.json(mapFuelTxn(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Fuel transaction with this id already exists.' }, { status: 409 });
    }
    console.error('[fuel.post]', error);
    return NextResponse.json({ error: 'Failed to create fuel transaction' }, { status: 500 });
  }
}