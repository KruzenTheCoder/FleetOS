'use client';

import { useStore } from '@/lib/store';

export function LiveFeed() {
  const { feed } = useStore();
  return (
    <div className="mt-3 max-h-[420px] overflow-auto thin-scroll space-y-2 text-sm">
      {feed.map((e, idx) => {
        const color = e.type==='telemetry' ? '#0A84FF' : e.type==='fuel' ? '#FF9500' : e.type==='eta' ? '#34C759' : e.type==='geo' ? '#5856D6' : '#0f172a';
        return (
          <div key={idx} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-2 rounded-full" style={{background:color}}></span>
            <div>
              <div className="font-medium">{e.msg}</div>
              <div className="text-slate-500 text-xs">{e.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 