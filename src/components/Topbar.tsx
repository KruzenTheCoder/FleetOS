"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoRefreshOutline,
  IoPersonCircleOutline,
  IoChevronDown,
} from "react-icons/io5";

export function Topbar() {
  const { setSearch, liveData, setLiveData, currentUser, logout } = useStore();
  const [range, setRange] = useState<"7" | "30" | "365">("7");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const name = currentUser?.name ?? "Guest";
  const role = currentUser?.role ?? "Not signed in";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-2.5 text-slate-400" />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vehicles, drivers, routes..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-72"
            />
          </div>
          <div className="segmented ml-1">
            {(["7", "30", "365"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRange(value)}
                className={value === range ? "active" : ""}
              >
                {value === "365" ? "12m" : `${value}d`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="chip">
            <span className="dot" style={{ background: "#10b981" }}></span>
            Systems nominal
          </span>
          <button type="button" className="chip">
            <IoRefreshOutline /> Refresh
          </button>
          <div className="flex items-center gap-3">
            <button type="button" className="relative">
              <IoNotificationsOutline className="text-2xl text-slate-700" />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full px-1.5 py-0.5">3</span>
            </button>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-2 cursor-pointer"
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
                <input type="checkbox" checked={liveData} onChange={(event) => setLiveData(event.target.checked)} />
                <span className="slider"></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}