import type {
  Route as RouteModel,
  Vehicle as VehicleModel,
  FuelTxn as FuelTxnModel,
  WorkOrder as WorkOrderModel,
  User as UserModel,
  Settings as SettingsModel,
} from '@prisma/client';
import type {
  Route as RouteDto,
  Vehicle as VehicleDto,
  FuelTxn as FuelTxnDto,
  WorkOrder as WorkOrderDto,
  User as UserDto,
  Settings as SettingsDto,
  LatLng,
} from './types';

function safeParse<T>(input: string | null | undefined, fallback: T): T {
  if (!input) return fallback;
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

export function mapRoute(route: RouteModel): RouteDto {
  return {
    id: route.id,
    name: route.name,
    color: route.color,
    points: safeParse<LatLng[]>(route.points, []),
    waypoints: route.waypoints ? safeParse(route.waypoints, []) : undefined,
  };
}

export function mapVehicle(vehicle: VehicleModel): VehicleDto {
  return {
    id: vehicle.id,
    driver: vehicle.driver,
    status: vehicle.status as VehicleDto['status'],
    fuel: vehicle.fuel,
    speed: vehicle.speed,
    odo: vehicle.odo,
    cargo: vehicle.cargo ?? undefined,
    pos: { lat: vehicle.posLat, lng: vehicle.posLng },
    routeId: vehicle.routeId ?? undefined,
    i: vehicle.indexOnRoute ?? undefined,
  };
}

export function mapFuelTxn(txn: FuelTxnModel): FuelTxnDto {
  return {
    id: txn.id,
    dt: txn.dt.toISOString(),
    vehicle: txn.vehicleId,
    liters: txn.liters,
    price: txn.price,
    total: txn.total ?? undefined,
    station: txn.station ?? undefined,
    odo: txn.odo ?? undefined,
  };
}

export function mapWorkOrder(order: WorkOrderModel): WorkOrderDto {
  return {
    id: order.id,
    vehicle: order.vehicleId,
    type: order.type,
    status: order.status as WorkOrderDto['status'],
    notes: order.notes ?? undefined,
    dueDate: order.dueDate ? order.dueDate.toISOString().slice(0, 10) : undefined,
    dueOdo: order.dueOdo ?? undefined,
  };
}

export function mapUser(user: UserModel): UserDto {
  return {
    name: user.name,
    role: user.role,
    email: user.email,
    phone: user.phone ?? undefined,
  };
}

export function mapSettings(settings: SettingsModel): SettingsDto {
  return {
    units: settings.units as SettingsDto['units'],
    currency: settings.currency as SettingsDto['currency'],
    tz: settings.tz,
    liveDataDefault: settings.liveDataDefault as SettingsDto['liveDataDefault'],
    refreshRate: settings.refreshRate,
  };
}

export function serializeRouteInput(route: RouteDto) {
  return {
    id: route.id,
    name: route.name,
    color: route.color,
    points: JSON.stringify(route.points ?? []),
    waypoints: route.waypoints ? JSON.stringify(route.waypoints) : null,
  };
}

export function serializeVehicleInput(vehicle: VehicleDto) {
  return {
    id: vehicle.id,
    driver: vehicle.driver,
    status: vehicle.status,
    fuel: vehicle.fuel,
    speed: vehicle.speed,
    odo: vehicle.odo,
    cargo: vehicle.cargo ?? null,
    posLat: vehicle.pos.lat,
    posLng: vehicle.pos.lng,
    indexOnRoute: vehicle.i ?? null,
    routeId: vehicle.routeId ?? null,
  };
}

export function serializeFuelTxnInput(txn: FuelTxnDto) {
  return {
    id: txn.id,
    dt: new Date(txn.dt),
    liters: txn.liters,
    price: txn.price,
    total: txn.total ?? txn.liters * txn.price,
    station: txn.station ?? null,
    odo: txn.odo ?? null,
    vehicleId: txn.vehicle,
  };
}

export function serializeWorkOrderInput(order: WorkOrderDto) {
  return {
    id: order.id,
    type: order.type,
    status: order.status,
    notes: order.notes ?? null,
    dueDate: order.dueDate ? new Date(order.dueDate) : null,
    dueOdo: order.dueOdo ?? null,
    vehicleId: order.vehicle,
  };
}

export function serializeSettingsInput(settings: SettingsDto) {
  return {
    units: settings.units,
    currency: settings.currency,
    tz: settings.tz,
    liveDataDefault: settings.liveDataDefault,
    refreshRate: settings.refreshRate,
  };
}