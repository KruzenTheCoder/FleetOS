import type { LatLng } from './types';

export const COLORS = {
  'En Route': '#0A84FF',
  'Idle': '#8E8E93',
  'At Depot': '#34C759',
  'Maintenance': '#FF3B30'
} as const;

export const toRad = (d: number) => d * Math.PI / 180;

export const haversine = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function interpolatePoints(a: LatLng, b: LatLng, steps = 40, j = 0.000) {
  const arr: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = lerp(a.lat, b.lat, t) + (Math.random() - 0.5) * j;
    const lng = lerp(a.lng, b.lng, t) + (Math.random() - 0.5) * j;
    arr.push({ lat, lng });
  }
  return arr;
}

export function makeRoutePath(points: LatLng[], density = 40) {
  let out: LatLng[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    out = out.concat(interpolatePoints(points[i], points[i + 1], density, 0.0005));
  }
  return out;
}

export function csvDownload(filename: string, rows: (string | number)[][]) {
  const process = rows.map(r =>
    r
      .map(v => {
        const s = String(v ?? '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
        return s;
      })
      .join(',')
  ).join('\n');

  const blob = new Blob([process], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatCurrency(amount: number, currency = 'ZAR') {
  const value = Number.isFinite(amount) ? amount : 0;
  const currencySymbols: Record<string, string> = {
    ZAR: 'R',
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
  };
  const symbol = currencySymbols[currency] ?? currency;
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return `${symbol} ${formatter.format(value)}`;
}

export const kmToMi = (km: number) => km * 0.621371;
export const kmhToMph = (kmh: number) => kmh * 0.621371;
