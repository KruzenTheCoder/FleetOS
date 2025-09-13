'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { IoNotificationsOutline, IoSearchOutline, IoRefreshOutline, IoPersonCircleOutline, IoMenu } from 'react-icons/io5';

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { setSearch, liveData, setLiveData } = useStore();
  const [range, setRange] = useState<'7' | '30' | '365'>('7');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 md:h-16 py-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button className="md:hidden" onClick={onMenu}>
            <IoMenu className="text-2xl" />
          </button>
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3 top-2.5 text-slate-400" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles, drivers, routes..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-full md:w-72"
            />
          </div>
          <div className="segmented ml-1 hidden sm:flex">
            {(['7', '30', '365'] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={r === range ? 'active' : ''}>
                {r === '365' ? '12m' : r + 'd'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
          <span className="chip hidden sm:inline-flex">
            <span className="dot" style={{ background: '#10b981' }}></span>
            Systems nominal
          </span>
          <button className="chip hidden sm:flex">
            <IoRefreshOutline /> Refresh
          </button>
          <div className="flex items-center gap-3 relative">
            <button className="relative">
              <IoNotificationsOutline className="text-2xl text-slate-700" />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full px-1.5 py-0.5">3</span>
            </button>
            <div
              className="flex items-center gap-2 cursor-pointer relative"
              ref={menuRef}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/20 to-indigo-500/20 flex items-center justify-center">
                <IoPersonCircleOutline className="text-3xl text-slate-700" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold">Admin User</div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass p-2 shadow-soft z-50">
                  <a className="block px-3 py-1.5 rounded-lg hover:bg-slate-100" href="#">
                    Profile
                  </a>
                  <a className="block px-3 py-1.5 rounded-lg hover:bg-slate-100" href="#">
                    Settings
                  </a>
                  <a className="block px-3 py-1.5 rounded-lg hover:bg-slate-100" href="#">
                    Logout
                  </a>
                </div>
              )}
            </div>
            <label className="live-data-toggle">
              <span>Live Data</span>
              <span className="toggle-switch">
                <input
                  type="checkbox"
                  checked={liveData}
                  onChange={(e) => setLiveData(e.target.checked)}
                />
                <span className="slider"></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

