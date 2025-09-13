'use client';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-brand border-t-transparent ${className}`}></div>
  );
}
