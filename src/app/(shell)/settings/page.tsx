'use client';

import { useStore } from '@/lib/store';

export default function SettingsPage() {
  const { settings, setSettings } = useStore();

  const save = () => {
    alert('Settings saved.');
  };

  const reset = () => {
    localStorage.removeItem('fleetos_state');
    location.reload();
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="text-xl font-bold">Settings</div>
      <div className="glass p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="label">Units</div>
            <select className="input" value={settings.units} onChange={e=>setSettings({ units: e.target.value as any })}>
              <option value="metric">Metric (km, L)</option>
              <option value="imperial">Imperial (mi, gal)</option>
            </select>
          </div>
          <div>
            <div className="label">Currency</div>
            <select className="input" value={settings.currency} onChange={e=>setSettings({ currency: e.target.value as any })}>
              <option value="ZAR">ZAR (R)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <div className="label">Timezone</div>
            <select className="input" value={settings.tz} onChange={e=>setSettings({ tz: e.target.value })}>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="UTC">UTC</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
            </select>
          </div>
          <div>
            <div className="label">Live Data Default</div>
            <select className="input" value={settings.liveDataDefault} onChange={e=>setSettings({ liveDataDefault: e.target.value as any })}>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div>
            <div className="label">Data Refresh Rate</div>
            <select className="input" value={String(settings.refreshRate)} onChange={e=>setSettings({ refreshRate: parseInt(e.target.value) })}>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="chip" onClick={save}>Save</button>
          </div>
        </div>
      </div>

      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Data</div>
            <div className="text-sm text-slate-500">Reset local datZa (vehicles, routes, fuel, maintenance, users, reports)</div>
          </div>
          <button className="chip badge" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}