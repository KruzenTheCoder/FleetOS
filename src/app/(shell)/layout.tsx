import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import ClientBootstrap from '@/components/ClientBootstrap';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar: always visible; sticky full height */}
      <aside className="flex flex-col w-72 shrink-0 sticky top-0 h-screen p-6 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <Sidebar />
      </aside>

      {/* Main column */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
          <Topbar />
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      {/* Client bootstrap (live simulation) */}
      <ClientBootstrap />
    </div>
  );
}