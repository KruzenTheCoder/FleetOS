import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapWorkOrder } from '@/lib/serializers';

type Params = { params: { id: string } };

function buildWorkOrderUpdate(payload: any) {
  const data: Record<string, unknown> = {};
  if (payload.type !== undefined) data.type = payload.type;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.notes !== undefined) data.notes = payload.notes ?? null;
  if (payload.dueDate !== undefined) data.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
  if (payload.dueOdo !== undefined) data.dueOdo = payload.dueOdo ?? null;
  if (payload.vehicle !== undefined) data.vehicleId = payload.vehicle;
  return data;
}

export async function PATCH(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Work order id is required' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updateData = buildWorkOrderUpdate(payload?.workOrder ?? payload);
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.workOrder.update({ where: { id }, data: updateData });
    return NextResponse.json(mapWorkOrder(updated));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }
    console.error('[maintenance.patch]', error);
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Work order id is required' }, { status: 400 });
  }

  try {
    await prisma.workOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }
    console.error('[maintenance.delete]', error);
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 });
  }
}