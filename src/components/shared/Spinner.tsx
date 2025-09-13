'use client';

import { useId } from 'react';

export function Spinner({ className = '' }: { className?: string }) {
  const id = useId();
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`spinner-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle
        cx="25"
        cy="25"
        r="22"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="25"
        cy="25"
        r="22"
        stroke={`url(#spinner-${id})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 140"
        fill="none"
      />
    </svg>
  );
}
