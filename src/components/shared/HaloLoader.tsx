'use client';

import { useEffect, useState } from 'react';

export function HaloLoader({ className = '' }: { className?: string }) {
  const steps = ['Configuring', 'Spinning up layout', 'Retrieving layout'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % steps.length), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand to-indigo-500 opacity-30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand/60 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-brand font-semibold">{steps[idx]}</p>
    </div>
  );
}
