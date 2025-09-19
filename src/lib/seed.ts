import type { Vehicle, Route, Settings, FuelTxn, WorkOrder, User } from './types';
import { makeRoutePath } from './utils';


export const depot = { lat: -33.9249, lng: 18.4241 }; // Cape Town

const P = {
  capeTown: {lat:-33.9249, lng:18.4241},
  johannesburg: {lat:-26.2041, lng:28.0473},
  durban: {lat:-29.8587, lng:31.0218},
  portElizabeth: {lat:-33.9610, lng:25.6136},
  pretoria: {lat:-25.7479, lng:28.2293},
  bloemfontein: {lat:-29.0852, lng:26.1596},
  eastLondon: {lat:-33.0153, lng:27.9116},
  nelspruit: {lat:-25.4748, lng:30.9846},
};

export function seedRoutes(): Route[] {
  const routeA = makeRoutePath([P.capeTown, P.johannesburg], 50);
  const routeB = makeRoutePath([P.durban, P.pretoria], 50);
  const routeC = makeRoutePath([P.portElizabeth, P.bloemfontein], 50);
  return [
    { id:'A', name:'Cape Town to Johannesburg', color:'#0A84FF', points:routeA },
    { id:'B', name:'Durban to Pretoria', color:'#34C759', points:routeB },
    { id:'C', name:'Port Elizabeth to Bloemfontein', color:'#5856D6', points:routeC },
  ];
}

export function seedUsers(): User[] {
  return [
    { name:'Anele Nkosi', role:'Manager', email:'anele@fleet.co.za', phone:'+27 82 000 1111' },
    { name:'Thabo Mokoena', role:'Dispatcher', email:'thabo@fleet.co.za', phone:'+27 83 111 2222' },
    { name:'Lerato Dlamini', role:'Admin', email:'lerato@fleet.co.za', phone:'+27 84 222 3333' },
  ];
}

export function seedVehicles(routes?: Route[]): Vehicle[] {
  const rs = routes ?? seedRoutes();
  const byId = Object.fromEntries(rs.map(route => [route.id, route.points])) as Record<string, Route['points']>;
  const fallback = depot;
  const getPoint = (routeId: string, index: number) => {
    const points = byId[routeId];
    if (!points || points.length === 0) return fallback;
    return points[Math.min(index, points.length - 1)];
  };

  return [
    { id:'TRK-101', driver:'Ava', status:'En Route', fuel:72, speed:52, odo:148203, pos:getPoint('A', 0), routeId:'A', i:0, cargo:'Consumer goods' },
    { id:'TRK-102', driver:'Noah', status:'Idle', fuel:64, speed:0, odo:122431, pos:{lat:-33.91, lng:18.41}, cargo:'N/A' },
    { id:'TRK-103', driver:'Liam', status:'En Route', fuel:58, speed:48, odo:201883, pos:getPoint('B', 10), routeId:'B', i:10, cargo:'Food & Bev' },
    { id:'TRK-104', driver:'Emma', status:'En Route', fuel:80, speed:55, odo:175000, pos:{lat:-26.21, lng:28.05}, routeId:'A', i:5, cargo:'Electronics' },
    { id:'TRK-105', driver:'Lucas', status:'Idle', fuel:44, speed:0, odo:99021, pos:{lat:-29.86, lng:31.02}, cargo:'N/A' },
    { id:'TRK-106', driver:'Mia', status:'At Depot', fuel:95, speed:0, odo:50231, pos:depot, cargo:'N/A' },
    { id:'TRK-107', driver:'Ethan', status:'Maintenance', fuel:33, speed:0, odo:220441, pos:{lat:-33.96, lng:25.61}, cargo:'N/A' },
    { id:'TRK-108', driver:'Olivia', status:'En Route', fuel:69, speed:60, odo:188775, pos:getPoint('C', 30), routeId:'C', i:30, cargo:'Pharma' },
    { id:'TRK-109', driver:'Jack', status:'Idle', fuel:51, speed:0, odo:136552, pos:{lat:-25.75, lng:28.23}, cargo:'N/A' },
    { id:'TRK-110', driver:'Sophia', status:'At Depot', fuel:88, speed:0, odo:18233, pos:{lat:-29.09, lng:26.16}, cargo:'N/A' },
    { id:'TRK-111', driver:'Mason', status:'Maintenance', fuel:22, speed:0, odo:240103, pos:{lat:-33.02, lng:27.91}, cargo:'N/A' },
    { id:'TRK-112', driver:'Isabella', status:'En Route', fuel:61, speed:49, odo:165821, pos:{lat:-25.47, lng:30.98}, routeId:'B', i:3, cargo:'Retail' },
  ];
}
export function seedFuel(): FuelTxn[] {
  return [
    { id:'F001', dt:new Date().toISOString(), vehicle:'TRK-101', liters:42, price:24.5, total:1029, station:'BP Cape Town', odo:148240 },
    { id:'F002', dt:new Date(Date.now()-86400000).toISOString(), vehicle:'TRK-103', liters:38, price:24.2, total:920, station:'Engen Johannesburg', odo:201940 },
    { id:'F003', dt:new Date(Date.now()-2*86400000).toISOString(), vehicle:'TRK-108', liters:50, price:24.6, total:1230, station:'Shell Durban', odo:188900 },
  ];
}

export function seedMaint(): WorkOrder[] {
  function daysFromNow(d:number){ const t=new Date(); t.setDate(t.getDate()+d); return t.toISOString().slice(0,10); }
  return [
    { id:'WO-1001', vehicle:'TRK-111', type:'Brake Pads', dueDate:daysFromNow(2), status:'Open', notes:'Front pads' },
    { id:'WO-1002', vehicle:'TRK-106', type:'Oil Change', dueDate:daysFromNow(6), status:'Open', notes:'' },
    { id:'WO-1003', vehicle:'TRK-105', type:'Tire Rotation', dueDate:daysFromNow(9), status:'Open', notes:'' },
  ];
}

export const defaultSettings: Settings = {
  units:'metric', currency:'ZAR', tz:'Africa/Johannesburg', liveDataDefault:'on', refreshRate:10
};