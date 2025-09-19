'use client';

import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';
import { useMemo, useState } from 'react';
import { haversine } from '@/lib/utils';
import { RouteDrawModal } from '@/components/modals/RouteDrawModal';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

export default function RoutesPage() {
  const { routes, vehicles, addRoute, removeRoute, updateVehicle } = useStore();
  const routeDistances = useMemo(() => {
    const result: Record<string, number> = {};
    routes.forEach((route) => {
      let total = 0;
      for (let i = 1; i < route.points.length; i += 1) {
        total += haversine(route.points[i - 1], route.points[i]);
      }
      result[route.id] = total / 1000;
    });
    return result;
  }, [routes]);
  const [openDraw, setOpenDraw] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const assign = (routeId: string, vehicleId: string) => {
    const vehicle = vehicles.find((candidate) => candidate.id === vehicleId);
    const route = routes.find((candidate) => candidate.id === routeId);
    if (!vehicle || !route) return;
    updateVehicle(vehicle.id, { routeId: route.id, i: 0, pos: route.points[0], status: 'En Route', speed: 45 });
  };

  const del = () => {
    if (!selected) return;
    vehicles.forEach((vehicle) => {
      if (vehicle.routeId === selected) {
        updateVehicle(vehicle.id, { routeId: null, status: vehicle.status === 'En Route' ? 'Idle' : vehicle.status });
      }
    });
    removeRoute(selected);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Routes</div>
        <div className="flex items-center gap-2">
          <button className="chip badge" onClick={() => setOpenDraw(true)}>Start Draw</button>
          <button className="chip badge" onClick={del}>Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-5">
          <div className="font-semibold">Route Library</div>
          <div className="mt-3 space-y-2 text-sm">
            {routes.map((route) => {
              const count = vehicles.filter((vehicle) => vehicle.routeId === route.id).length;
              const distanceKm = routeDistances[route.id] ?? 0;
              const active = selected === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelected(route.id)}
                  className="p-2 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer"
                  style={{ outline: active ? '2px solid rgba(10,132,255,.3)' : 'none' }}
                >
                  <div>
                    <div className="font-semibold">{route.name}</div>
                    <div className="text-xs text-slate-500">ID: {route.id} - Vehicles: {count}</div>
                  </div>
                  <span className="chip badge">
                    <span className="dot" style={{ background: route.color }}></span>
                    {distanceKm.toFixed(1)} km
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            <div className="label">Assign to Vehicle</div>
            <div className="flex gap-2">
              <select id="rid" className="input">
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
              <select id="vid" className="input">
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.id} - {vehicle.driver}
                  </option>
                ))}
              </select>
              <button
                className="chip badge"
                onClick={() => {
                  const routeId = (document.getElementById('rid') as HTMLSelectElement).value;
                  const vehicleId = (document.getElementById('vid') as HTMLSelectElement).value;
                  assign(routeId, vehicleId);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="glass p-0 overflow-hidden lg:col-span-2">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="font-semibold">Routes Map</div>
            <div className="flex items-center gap-2">
              <span className="chip badge">
                <span className="dot" style={{ background: '#10b981' }}></span>Idle
              </span>
            </div>
          </div>
          <LiveMap />
        </div>
      </div>

      <RouteDrawModal open={openDraw} onClose={() => setOpenDraw(false)} />
    </div>
  );
}
