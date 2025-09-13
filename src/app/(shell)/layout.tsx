"use client";

import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import ClientBootstrap from '@/components/ClientBootstrap';
import { useState } from 'react';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 p-6 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl flex flex-col transform transition-transform md:sticky md:translate-x-0 md:h-screen md:flex md:shrink-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar />
      </aside>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main column */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
          <Topbar onMenu={() => setMobileOpen(true)} />
        </header>
        <div className="w-full px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      {/* Client bootstrap (live simulation) */}
      <ClientBootstrap />
    </div>
  );
}
