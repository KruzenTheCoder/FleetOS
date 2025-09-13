'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useStore } from '@/lib/store';
ChartJS.register(ArcElement, Tooltip);

export function UtilDonut() {
  const { vehicles } = useStore();
  const enRoute = vehicles.filter(v=>v.status==='En Route').length;
  const depot = vehicles.filter(v=>v.status==='At Depot').length;
  const idle = vehicles.filter(v=>v.status==='Idle').length;
  const maint = vehicles.filter(v=>v.status==='Maintenance').length;
  const utilPct = Math.round((enRoute/Math.max(1,vehicles.length))*100);
  const data = { labels:['En Route','At Depot','Idle','Maintenance'], datasets:[{ data:[enRoute,depot,idle,maint], backgroundColor:['#0A84FF','#34C759','#8E8E93','#FF3B30'], borderWidth:0 }] };
  return (
    <div className="relative h-[200px] w-full max-w-[220px] mx-auto">
      <Doughnut data={data} options={{cutout:'70%', plugins:{legend:{display:false}}, maintainAspectRatio:false}} />
      <div className="absolute inset-0 flex items-center justify-center font-semibold">{utilPct}%</div>
    </div>
  );
}