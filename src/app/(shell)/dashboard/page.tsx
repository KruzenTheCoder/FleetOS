'use client';

import dynamic from 'next/dynamic';
import { KpiCards } from '@/components/kpis/KpiCards';
import { DashboardLine } from '@/components/charts/DashboardLine';
import { UtilDonut } from '@/components/charts/UtilDonut';
import { LiveFeed } from '@/components/LiveFeed';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-500">Quick filters:</span>
        {/* Implement chips by updating store.statusFilter in your components if needed */}
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">Fuel Spend (R) & Distance</div>
            <div className="text-sm text-slate-500">Last 7 days</div>
          </div>
          <div className="h-[260px] mt-4">
            <DashboardLine />
          </div>
        </div>
        <div className="glass p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">Fleet Utilization</div>
            {/* Optional: a "Boost +5%" button could update a random vehicle to En Route */}
          </div>
          <div className="mt-2">
            <UtilDonut />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass p-0 overflow-hidden xl:col-span-2">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">Live Map</div>
            <div className="flex items-center gap-2">
              <span className="chip badge"><span className="dot" style={{background:'var(--brand)'}}></span>En Route</span>
              <span className="chip badge"><span className="dot" style={{background:'var(--neutral)'}}></span>Idle</span>
              <span className="chip badge"><span className="dot" style={{background:'var(--success)'}}></span>Depot</span>
              <span className="chip badge"><span className="dot" style={{background:'var(--danger)'}}></span>Maint</span>
            </div>
          </div>
          <LiveMap />
          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60">
            <div className="text-sm text-slate-500">South Africa · Live tracking</div>
          </div>
        </div>

        <div className="glass p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="font-semibold">Live Telemetry Feed</div>
            <span className="chip badge"><span className="dot" style={{background:'#10b981'}}></span>Connected</span>
          </div>
          <div className="text-sm text-slate-500">Real-time events</div>
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}