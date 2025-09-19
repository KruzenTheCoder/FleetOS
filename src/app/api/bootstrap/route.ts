import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  mapRoute,
  mapVehicle,
  mapFuelTxn,
  mapWorkOrder,
  mapUser,
  mapSettings,
} from '@/lib/serializers';
import { defaultSettings, seedRoutes, seedVehicles, seedFuel, seedMaint, seedUsers } from '@/lib/seed';

export async function GET() {
  try {
    const [routes, vehicles, fuelTxns, workOrders, users, settings] = await Promise.all([
      prisma.route.findMany({ orderBy: { id: 'asc' } }),
      prisma.vehicle.findMany({ orderBy: { id: 'asc' } }),
      prisma.fuelTxn.findMany({ orderBy: { dt: 'desc' } }),
      prisma.workOrder.findMany({ orderBy: { dueDate: 'asc' } }),
      prisma.user.findMany({ orderBy: { name: 'asc' } }),
      prisma.settings.findMany({ take: 1 }),
    ]);

    const fallbackSettings = settings[0] ? mapSettings(settings[0]) : defaultSettings;

    // Ensure demo data exists even if the database was cleared manually.
    if (!routes.length && !vehicles.length) {
      const seededRoutes = seedRoutes();
      const seededVehicles = seedVehicles(seededRoutes);
      const seededFuelTxns = seedFuel();
      const seededMaint = seedMaint();
      const seededUsers = seedUsers();

      return NextResponse.json({
        routes: seededRoutes,
        vehicles: seededVehicles,
        fuelTxns: seededFuelTxns,
        maint: seededMaint,
        users: seededUsers,
        settings: fallbackSettings,
        seeded: true,
      });
    }

    return NextResponse.json({
      routes: routes.map(mapRoute),
      vehicles: vehicles.map(mapVehicle),
      fuelTxns: fuelTxns.map(mapFuelTxn),
      maint: workOrders.map(mapWorkOrder),
      users: users.map(mapUser),
      settings: fallbackSettings,
      seeded: false,
    });
  } catch (error) {
    console.error('[bootstrap] Failed to load data', error);
    return NextResponse.json({ error: 'Failed to load initial data' }, { status: 500 });
  }
}