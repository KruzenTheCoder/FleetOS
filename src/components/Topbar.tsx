'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoRefreshOutline,
  IoPersonCircleOutline,
  IoMenu,
} from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { setSearch, liveData, setLiveData } = useStore();
  const router = useRouter();
  const [range, setRange] = useState<'7' | '30' | '365'>('7');
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 md:h-16 py-2">
        {/* Left section: menu + search + range selector */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button className="md:hidden" onClick={onMenu}>
            <IoMenu className="text-2xl" />
          </button>

          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3 top-2.5 text-slate-400" />
            <input
              placeholder="Search vehicles, drivers, routes..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-full md:w-72"
            />
          </div>

          <div className="segmented ml-1 hidden sm:flex">
            {(['7', '30', '365'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={r === range ? 'active' : ''}
              >
                {r === '365' ? '12m' : r + 'd'}
              </button>
            ))}
          </div>
        </div>

        {/* Right section: system status, refresh, alerts, user menu, live-data */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
          <span className="chip hidden sm:inline-flex">
            <span className="dot" style={{ background: '#10b981' }}></span>
            Systems nominal
          </span>

          <button className="chip hidden sm:flex" onClick={() => window.location.reload()}>
            <IoRefreshOutline /> Refresh
          </button>

          <div className="flex items-center gap-3 relative">
            {/* Alerts dropdown */}
            <button
              className="relative"
              ref={alertsRef}
              onClick={() => setAlertsOpen((o) => !o)}
            >
              <IoNotificationsOutline className="text-2xl text-slate-700" />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full px-1.5 py-0.5">
                2
              </span>
              {alertsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass p-2 shadow-soft z-50">
                  <div className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100">
                    Engine fault reported on TRK-104
                  </div>
                  <div className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100">
                    Service due for TRK-201 in 3 days
                  </div>
                </div>
              )}
            </button>

            {/* User menu */}
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
                  <a
                    className="block px-3 py-1.5 rounded-lg hover:bg-slate-100"
                    href="#"
                  >
                    Profile
                  </a>
                  <a
                    className="block px-3 py-1.5 rounded-lg hover:bg-slate-100"
                    href="#"
                  >
                    Settings
                  </a>
                  <button
                    className="block w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/login');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Live data toggle */}
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
