'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { csvDownload } from '@/lib/utils';
import { ReportsLine } from '@/components/charts/DashboardLine'; // reuse line chart if you want or make a separate

export default function ReportsPage() {
  const { fuelTxns } = useStore();
  const [range, setRange] = useState('7');
  const [metric, setMetric] = useState<'fuel'|'distance'|'speed'|'util'>('fuel');
  const [group, setGroup] = useState<'day'|'week'>('day');
  const [vehicle, setVehicle] = useState<'all'|string>('all');

  const exportCSV = () => {
    // For demo: export fuel transactions
    const rows = [['Metric','Range','Group','Vehicle'], [metric, range, group, vehicle]];
    csvDownload('report.csv', rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Reports</div>
        <div className="flex items-center gap-2">
          <button className="chip badge" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="glass p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="label">Range</div>
            <select className="input" value={range} onChange={e=>setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div>
            <div className="label">Metrics</div>
            <select className="input" value={metric} onChange={e=>setMetric(e.target.value as any)}>
              <option value="fuel">Fuel Spend</option>
              <option value="distance">Distance</option>
              <option value="speed">Average Speed</option>
              <option value="util">Utilization</option>
            </select>
          </div>
          <div>
            <div className="label">Group by</div>
            <select className="input" value={group} onChange={e=>setGroup(e.target.value as any)}>
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
          </div>
          <div>
            <div className="label">Vehicle Filter</div>
            <select className="input" value={vehicle} onChange={e=>setVehicle(e.target.value as any)}>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass p-5">
        <div className="h-[260px]">
          <ReportsLine />
        </div>
      </div>
    </div>
  );
}