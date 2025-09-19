import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapUser } from '@/lib/serializers';

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(users.map(mapUser));
  } catch (error) {
    console.error('[users.get]', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = payload?.user ?? payload;
    if (!user?.name || !user?.email || !user?.role) {
      return NextResponse.json({ error: 'User name, email and role are required.' }, { status: 400 });
    }

    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone ?? null,
      },
    });

    return NextResponse.json(mapUser(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
    }
    console.error('[users.post]', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}