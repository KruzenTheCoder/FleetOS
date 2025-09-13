'use client';

export function LoadingBars({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bars" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="20" height="100" fill="url(#bars)">
        <animate attributeName="height" values="100;20;100" begin="0s" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="10;90;10" begin="0s" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x="45" y="10" width="20" height="100" fill="url(#bars)">
        <animate attributeName="height" values="100;20;100" begin="0.15s" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="10;90;10" begin="0.15s" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x="80" y="10" width="20" height="100" fill="url(#bars)">
        <animate attributeName="height" values="100;20;100" begin="0.3s" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="10;90;10" begin="0.3s" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
