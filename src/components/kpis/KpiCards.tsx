'use client';

import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function KpiCards() {
  const { vehicles, todayFuelSpend, todayKm, todayAvgSpeed, settings } = useStore();
  const active = vehicles.filter(v=>v.status!=='Maintenance').length;
  const total = vehicles.length;
  const activePct = Math.round((active/Math.max(1,total))*100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">Active Vehicles</div>
          <div className="text-brand text-xl">🚚</div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold">{active}</div>
          <div className="text-sm text-slate-500">of {total}</div>
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full"><div className="h-2 bg-brand rounded-full" style={{width:`${activePct}%`}}></div></div>
      </div>

      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">On-time Delivery</div>
          <div className="text-iosGreen text-xl">✅</div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold">92%</div>
          <div className="text-sm text-iosGreen font-semibold">+2.4%</div>
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full"><div className="h-2 bg-iosGreen rounded-full" style={{width:`92%`}}></div></div>
      </div>

      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">Fuel Spend (Today)</div>
          <div className="text-iosOrange text-xl">⛽</div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold">{formatCurrency(todayFuelSpend, settings.currency)}</div>
          <div className="text-sm text-slate-500">~</div>
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full"><div className="h-2 bg-iosOrange rounded-full" style={{width:`68%`}}></div></div>
      </div>

      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">Distance Traveled</div>
          <div className="text-iosIndigo text-xl">🧭</div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold">{Math.round(todayKm)} km</div>
          <div className="text-sm text-slate-500">Today</div>
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full"><div className="h-2 bg-iosIndigo rounded-full" style={{width:`54%`}}></div></div>
      </div>
    </div>
  );
}