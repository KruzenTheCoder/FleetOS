import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapUser } from '@/lib/serializers';

type Params = { params: { email: string } };

function decodeEmail(value: string | undefined) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildUserUpdate(payload: any) {
  const data: Record<string, unknown> = {};
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.role !== undefined) data.role = payload.role;
  if (payload.phone !== undefined) data.phone = payload.phone ?? null;
  return data;
}

export async function PATCH(request: Request, { params }: Params) {
  const email = decodeEmail(params.email);
  if (!email) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updateData = buildUserUpdate(payload?.user ?? payload);
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.user.update({ where: { email }, data: updateData });
    return NextResponse.json(mapUser(updated));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('[users.patch]', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const email = decodeEmail(params.email);
  if (!email) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { email } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('[users.delete]', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}