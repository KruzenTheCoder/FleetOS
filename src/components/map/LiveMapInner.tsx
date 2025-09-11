'use client';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LTooltip, useMap } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import { useMemo, useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { COLORS } from '@/lib/utils';

function makeIcon(status: string) {
  const ring = (COLORS as any)[status] ?? '#0A84FF';
  const html = `<div class="marker ${status==='En Route'?'pulse':''}" style="--ring:${ring}"><div class="emoji">🚚</div></div>`;
  return L.divIcon({ className:'', html, iconSize:[38,38], iconAnchor:[19,19] }) as DivIcon;
}

function FitBounds() {
  const map = useMap();
  const { vehicles } = useStore();
  useEffect(() => {
    const bounds = L.latLngBounds(vehicles.map(v=>[v.pos.lat, v.pos.lng]));
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));
  }, [vehicles, map]);
  return null;
}

export default function LiveMapInner() {
  const { vehicles, routes } = useStore();
  const [showRoutes, setShowRoutes] = useState(true);

  const markers = useMemo(()=> vehicles.map(v=>({ id:v.id, pos:v.pos, icon: makeIcon(v.status), v })), [vehicles]);

  const lines = useMemo(()=>{
    if (!showRoutes) return [];
    return vehicles
      .filter(v=>v.routeId)
      .map(v=>{
        const r = routes.find(x=>x.id===v.routeId);
        return r ? r.points.map(p=>[p.lat, p.lng]) : [];
      });
  }, [vehicles, routes, showRoutes]);

  return (
    <div className="relative">
      <MapContainer center={[-30.5595, 22.9375]} zoom={5} style={{height: 440, width: '100%'}} zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds />
        {lines.map((latlngs, i)=>(
          <Polyline key={i} positions={latlngs as any} pathOptions={{ color: '#0A84FF', weight:5, opacity:.35 }} />
        ))}
        {markers.map(m=>(
          <Marker key={m.id} position={[m.pos.lat, m.pos.lng]} icon={m.icon}>
            <LTooltip>{m.v.id} • {m.v.driver} • {m.v.status}</LTooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}