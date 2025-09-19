'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoRefreshOutline,
  IoPersonCircleOutline,
  IoMenu,
  IoChevronDown,
} from 'react-icons/io5';

type TopbarProps = {
  onMenu?: () => void;
};

export function Topbar({ onMenu }: TopbarProps) {
  const { setSearch, liveData, setLiveData, currentUser, logout } = useStore();
  const [range, setRange] = useState<'7' | '30' | '365'>('7');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const alertsRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const name = currentUser?.name ?? 'Guest';
  const role = currentUser?.role ?? 'Not signed in';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 md:h-16 py-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button type="button" className="md:hidden" onClick={onMenu}>
            <IoMenu className="text-2xl" />
          </button>

          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3 top-2.5 text-slate-400" />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vehicles, drivers, routes..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-full md:w-72"
            />
          </div>

          <div className="segmented ml-1 hidden sm:flex">
            {(['7', '30', '365'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRange(value)}
                className={value === range ? 'active' : ''}
              >
                {value === '365' ? '12m' : `${value}d`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
          <span className="chip hidden sm:inline-flex">
            <span className="dot" style={{ background: '#10b981' }}></span>
            Systems nominal
          </span>

          <button type="button" className="chip hidden sm:flex" onClick={() => window.location.reload()}>
            <IoRefreshOutline /> Refresh
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative"
              ref={alertsRef}
              onClick={() => setAlertsOpen((open) => !open)}
            >
              <IoNotificationsOutline className="text-2xl text-slate-700" />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full px-1.5 py-0.5">2</span>
              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-56 glass p-2 shadow-soft z-50">
                  <div className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100">Engine fault reported on TRK-104</div>
                  <div className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100">Service due for TRK-201 in 3 days</div>
                </div>
              )}
            </button>

            <div className="flex items-center gap-2 cursor-pointer relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex items-center gap-2"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/20 to-indigo-500/20 flex items-center justify-center">
                  <IoPersonCircleOutline className="text-3xl text-slate-700" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
                <IoChevronDown className="text-slate-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-2 text-sm z-50">
                  {currentUser ? (
                    <>
                      <div className="px-3 pb-2 text-[11px] uppercase tracking-wide text-slate-400">Account</div>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-1.5 text-slate-500">Signed out</div>
                  )}
                </div>
              )}
            </div>

            <label className="live-data-toggle">
              <span>Live Data</span>
              <span className="toggle-switch">
                <input
                  type="checkbox"
                  checked={liveData}
                  onChange={(event) => setLiveData(event.target.checked)}
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
