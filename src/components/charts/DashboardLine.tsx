'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export function DashboardLine() {
  const { settings } = useStore();
  const data = {
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets:[
      { label:'Fuel Spend', data:[2100,2300,2000,2500,2800,2400,2600], borderColor:'#0A84FF', backgroundColor:'rgba(10,132,255,0.25)', fill:true, tension:.35, borderWidth:2, pointRadius:3, yAxisID:'y1' },
      { label:`Distance (${settings.units==='imperial'?'mi':'km'})`, data:[280,310,260,340,390,320,330], borderColor:'#34C759', backgroundColor:'rgba(52,199,89,0.25)', fill:true, tension:.35, borderWidth:2, pointRadius:3, yAxisID:'y2' }
    ],
  };
  const options:any = {
    responsive:true, maintainAspectRatio:false,
    scales:{
      y1:{ position:'left', grid:{display:false}, ticks:{ callback:(v:any)=>formatCurrency(Number(v), settings.currency)} },
      y2:{ position:'right', grid:{display:false} },
      x:{ grid:{display:false} }
    },
    plugins:{ legend:{ display:true, labels:{ usePointStyle:true, pointStyle:'circle' } } },
  };
  return <Line data={data} options={options} />;
}

export function ReportsLine() {
  return <DashboardLine />;
}