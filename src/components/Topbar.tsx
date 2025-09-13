'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { IoNotificationsOutline, IoSearchOutline, IoRefreshOutline, IoPersonCircleOutline, IoMenu } from 'react-icons/io5';

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { setSearch, liveData, setLiveData } = useStore();
  const [range, setRange] = useState<'7'|'30'|'365'>('7');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={onMenu}>
            <IoMenu className="text-2xl" />
          </button>
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-2.5 text-slate-400" />
            <input onChange={(e)=>setSearch(e.target.value)} placeholder="Search vehicles, drivers, routes..." className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-72" />
          </div>
          <div className="segmented ml-1">
            {(['7','30','365'] as const).map(r=>(
              <button key={r} onClick={()=>setRange(r)} className={r===range ? 'active' : ''}>{r==='365'?'12m':r+'d'}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="chip"><span className="dot" style={{background:'#10b981'}}></span>Systems nominal</span>
          <button className="chip"><IoRefreshOutline/> Refresh</button>
          <div className="flex items-center gap-3 relative">
            <button className="relative">
              <IoNotificationsOutline className="text-2xl text-slate-700"/>
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full px-1.5 py-0.5">3</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/20 to-indigo-500/20 flex items-center justify-center">
                <IoPersonCircleOutline className="text-3xl text-slate-700"/>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold">Admin User</div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
            </div>
            <label className="live-data-toggle">
              <span>Live Data</span>
              <span className="toggle-switch">
                <input type="checkbox" checked={liveData} onChange={(e)=>setLiveData(e.target.checked)} />
                <span className="slider"></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}