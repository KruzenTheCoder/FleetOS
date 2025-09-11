export type LatLng = { lat: number; lng: number };

export type Route = {
  id: string;
  name: string;
  color: string;
  points: LatLng[];
  waypoints?: { lat: number; lng: number; address?: string }[];
};

export type Vehicle = {
  id: string;
  driver: string;
  status: 'En Route' | 'Idle' | 'At Depot' | 'Maintenance';
  fuel: number;
  speed: number;
  odo: number;
  pos: LatLng;
  routeId?: string | null;
  i?: number;
  cargo?: string;
};

export type FuelTxn = {
  id: string;
  dt: string;
  vehicle: string;
  liters: number;
  price: number;
  total?: number;
  station?: string;
  odo?: number | null;
};

export type WorkOrder = {
  id: string;
  vehicle: string;
  type: string;
  dueDate?: string | null;
  dueOdo?: number | null;
  status: 'Open' | 'Completed';
  notes?: string;
};

export type Settings = {
  units: 'metric' | 'imperial';
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  tz: string;
  liveDataDefault: 'on' | 'off';
  refreshRate: number; // seconds
};

export type FeedItem = { time: string; type: 'telemetry'|'fuel'|'eta'|'geo'|'event'; msg: string };
export type User = { name:string; role:string; email:string; phone?:string };