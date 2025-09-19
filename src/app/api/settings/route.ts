import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapSettings, serializeSettingsInput } from '@/lib/serializers';
import { defaultSettings } from '@/lib/seed';

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    return NextResponse.json(settings ? mapSettings(settings) : defaultSettings);
  } catch (error) {
    console.error('[settings.get]', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const settings = payload?.settings ?? payload;
    if (!settings) {
      return NextResponse.json({ error: 'Settings payload is required' }, { status: 400 });
    }

    const data = serializeSettingsInput({ ...defaultSettings, ...settings });
    const updated = await prisma.settings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    return NextResponse.json(mapSettings(updated));
  } catch (error) {
    console.error('[settings.put]', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}