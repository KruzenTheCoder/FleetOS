'use client';
import { useEffect, useRef } from 'react';
import { useStore } from './store';
import { haversine } from './utils';

export function useSimulation() {
  const { vehicles, routes, liveData, settings, updateVehicle, setToday, pushFeed } = useStore();
  const tickRef = useRef<any>(null);
  const feedRef = useRef<any>(null);

  useEffect(() => {
    if (!liveData) {
      clearInterval(tickRef.current);
      clearInterval(feedRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      let totalKmDelta=0, totalSpeed=0, speedCount=0;
      vehicles.forEach(v => {
        const r = routes.find(x=>x.id===v.routeId!);
        if (r && v.status==='En Route') {
          const i = ((v.i || 0) + 1) % r.points.length;
          const prev = v.pos; const next = r.points[i];
          const d = haversine(prev, next);
          const sp = Math.max(25, Math.min(85, (d*3.6)));
          updateVehicle(v.id, {
            i, pos: next, speed: sp, odo: v.odo + d/1000, fuel: Math.max(5, v.fuel - 0.03 * (sp/60))
          });
          totalKmDelta += d/1000; totalSpeed += sp; speedCount++;
        }
      });
      setToday({
        todayKm: (window as any).__todayKm ? (window as any).__todayKm += totalKmDelta : 2100 + totalKmDelta,
        todayFuelSpend: (window as any).__todayFuelSpend ? (window as any).__todayFuelSpend += totalKmDelta * 0.28 * 24.5 : 2400 + totalKmDelta * 0.28 * 24.5,
        todayAvgSpeed: speedCount ? Math.round(totalSpeed/speedCount) : 0
      });
    }, settings.refreshRate*1000);

    feedRef.current = setInterval(() => {
      const v = vehicles[Math.floor(Math.random()*vehicles.length)];
      if (!v) return;
      const types = [
        () => ({ type:'telemetry' as const, msg:`${v.id} speed ${Math.max(0, Math.round(v.speed-3))}→${Math.round(v.speed)} km/h` }),
        () => ({ type:'fuel' as const, msg:`${v.id} fuel ${Math.round(v.fuel)}%` }),
        () => ({ type:'eta' as const, msg:`${v.id} ETA ${v.i? 25+Math.round((1-(v.i/200))*60): 0} min` }),
        () => ({ type:'geo' as const, msg:`${v.id} near ${(v.pos.lat).toFixed(3)}, ${(v.pos.lng).toFixed(3)}` }),
        () => ({ type:'event' as const, msg:`${v.id} ${['departed depot','arrived stop','short idle','traffic slow'][Math.floor(Math.random()*4)]}` }),
      ];
      const item = types[Math.floor(Math.random()*types.length)]();
      pushFeed({ time: new Date().toLocaleTimeString(), ...item });
    }, 2000);

    return () => { clearInterval(tickRef.current); clearInterval(feedRef.current); };
  }, [liveData, settings.refreshRate, vehicles, routes, updateVehicle, setToday, pushFeed]);
}