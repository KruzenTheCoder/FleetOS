'use client';
import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useStore } from '@/lib/store';
ChartJS.register(ArcElement, Tooltip);

export function UtilDonut() {
  const { vehicles } = useStore();

  const { data, utilPct } = useMemo(() => {
    const enRoute = vehicles.filter((vehicle) => vehicle.status === 'En Route').length;
    const depot = vehicles.filter((vehicle) => vehicle.status === 'At Depot').length;
    const idle = vehicles.filter((vehicle) => vehicle.status === 'Idle').length;
    const maint = vehicles.filter((vehicle) => vehicle.status === 'Maintenance').length;
    const percentage = Math.round((enRoute / Math.max(1, vehicles.length)) * 100);

    return {
      utilPct: percentage,
      data: {
        labels: ['En Route', 'At Depot', 'Idle', 'Maintenance'],
        datasets: [
          {
            data: [enRoute, depot, idle, maint],
            backgroundColor: ['#0A84FF', '#34C759', '#8E8E93', '#FF3B30'],
            borderWidth: 0,
          },
        ],
      },
    };
  }, [vehicles]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative h-48 w-48">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-semibold">{utilPct}%</span>
          <span className="text-xs uppercase tracking-wide text-slate-500">Utilized</span>
        </div>
      </div>
    </div>
  );
}
