import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapWorkOrder, serializeWorkOrderInput } from '@/lib/serializers';

export async function GET() {
  try {
    const orders = await prisma.workOrder.findMany({ orderBy: { dueDate: 'asc' } });
    return NextResponse.json(orders.map(mapWorkOrder));
  } catch (error) {
    console.error('[maintenance.get]', error);
    return NextResponse.json({ error: 'Failed to load maintenance work orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const workOrder = payload?.workOrder ?? payload;
    if (!workOrder?.id || !workOrder?.vehicle || !workOrder?.type || !workOrder?.status) {
      return NextResponse.json({ error: 'Work order id, vehicle, type and status are required.' }, { status: 400 });
    }

    const data = serializeWorkOrderInput(workOrder);
    const created = await prisma.workOrder.create({ data });
    return NextResponse.json(mapWorkOrder(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Work order with this id already exists.' }, { status: 409 });
    }
    console.error('[maintenance.post]', error);
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}