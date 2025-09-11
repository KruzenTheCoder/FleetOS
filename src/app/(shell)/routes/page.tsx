'use client';

import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';
import { useMemo, useState } from 'react';
import { RouteDrawModal } from '@/components/modals/RouteDrawModal';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

export default function RoutesPage() {
  const { routes, vehicles, addRoute, removeRoute, updateVehicle } = useStore();
  const [openDraw, setOpenDraw] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const assign = (routeId: string, vehicleId: string) => {
    const v = vehicles.find(x=>x.id===vehicleId);
    const r = routes.find(x=>x.id===routeId);
    if (!v || !r) return;
    updateVehicle(v.id, { routeId: r.id, i: 0, pos: r.points[0], status: 'En Route', speed: 45 });
  };

  const del = () => {
    if (!selected) return;
    // Unassign vehicles
    vehicles.forEach(v => {
      if (v.routeId === selected) updateVehicle(v.id, { routeId: null, status: v.status === 'En Route' ? 'Idle' : v.status });
    });
    removeRoute(selected);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Routes</div>
        <div className="flex items-center gap-2">
          <button className="chip badge" onClick={()=>setOpenDraw(true)}>Start Draw</button>
          <button className="chip badge" onClick={del}>Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-5">
          <div className="font-semibold">Route Library</div>
          <div className="mt-3 space-y-2 text-sm">
            {routes.map(r=>{
              const count = vehicles.filter(v=>v.routeId===r.id).length;
              const active = selected === r.id;
              return (
                <div key={r.id} onClick={()=>setSelected(r.id)} className="p-2 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer" style={{ outline: active ? '2px solid rgba(10,132,255,.3)' : 'none' }}>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">ID: {r.id} • Vehicles: {count}</div>
                  </div>
                  <span className="chip badge"><span className="dot" style={{background:r.color}}></span>{Math.round(r.points.length/2)} km</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            <div className="label">Assign to Vehicle</div>
            <div className="flex gap-2">
              <select id="rid" className="input">
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select id="vid" className="input">
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.id} — {v.driver}</option>)}
              </select>
              <button className="chip badge" onClick={()=>{
                const rid = (document.getElementById('rid') as HTMLSelectElement).value;
                const vid = (document.getElementById('vid') as HTMLSelectElement).value;
                assign(rid, vid);
              }}>Apply</button>
            </div>
          </div>
        </div>

        <div className="glass p-0 overflow-hidden lg:col-span-2">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="font-semibold">Routes Map</div>
            <div className="flex items-center gap-2">
              <span className="chip badge"><span className="dot" style={{background:'#10b981'}}></span>Idle</span>
            </div>
          </div>
          <LiveMap />
        </div>
      </div>

      <RouteDrawModal open={openDraw} onClose={()=>setOpenDraw(false)} />
    </div>
  );
}