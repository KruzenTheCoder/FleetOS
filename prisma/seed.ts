import { PrismaClient } from '@prisma/client';
import { seedRoutes, seedVehicles, seedFuel, seedMaint, seedUsers, defaultSettings } from '../src/lib/seed';

const prisma = new PrismaClient();

type LatLng = { lat: number; lng: number };

function serializePoints(points: LatLng[]): string {
  return JSON.stringify(points);
}

async function seed() {
  await prisma.fuelTxn.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  const routes = seedRoutes();
  await prisma.route.createMany({
    data: routes.map(route => ({
      id: route.id,
      name: route.name,
      color: route.color,
      points: serializePoints(route.points),
      waypoints: route.waypoints ? JSON.stringify(route.waypoints) : null,
    })),
  });

  const vehicles = seedVehicles(routes);
  for (const vehicle of vehicles) {
    await prisma.vehicle.create({
      data: {
        id: vehicle.id,
        driver: vehicle.driver,
        status: vehicle.status,
        fuel: vehicle.fuel,
        speed: vehicle.speed,
        odo: vehicle.odo,
        cargo: vehicle.cargo ?? null,
        posLat: vehicle.pos.lat,
        posLng: vehicle.pos.lng,
        indexOnRoute: typeof vehicle.i === 'number' ? vehicle.i : null,
        routeId: vehicle.routeId ?? null,
      },
    });
  }

  const fuelTxns = seedFuel();
  for (const txn of fuelTxns) {
    await prisma.fuelTxn.create({
      data: {
        id: txn.id,
        dt: new Date(txn.dt),
        liters: txn.liters,
        price: txn.price,
        total: txn.total ?? txn.liters * txn.price,
        station: txn.station ?? null,
        odo: txn.odo ?? null,
        vehicleId: txn.vehicle,
      },
    });
  }

  const maint = seedMaint();
  for (const wo of maint) {
    await prisma.workOrder.create({
      data: {
        id: wo.id,
        type: wo.type,
        status: wo.status,
        notes: wo.notes ?? null,
        dueDate: wo.dueDate ? new Date(wo.dueDate) : null,
        dueOdo: wo.dueOdo ?? null,
        vehicleId: wo.vehicle,
      },
    });
  }

  const users = seedUsers();
  await prisma.user.createMany({
    data: users.map(user => ({
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone ?? null,
    })),
  });

  await prisma.settings.create({
    data: {
      id: 1,
      units: defaultSettings.units,
      currency: defaultSettings.currency,
      tz: defaultSettings.tz,
      liveDataDefault: defaultSettings.liveDataDefault,
      refreshRate: defaultSettings.refreshRate,
    },
  });
}

seed()
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });