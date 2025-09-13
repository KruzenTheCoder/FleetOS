'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@/components/shared/Spinner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="glass p-8 w-full max-w-sm text-center space-y-6">
        <h1 className="text-2xl font-bold">FleetOS</h1>
        <button
          onClick={signIn}
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-xl shadow-soft hover:brightness-95 transition"
        >
          Sign In
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Spinner className="w-16 h-16" />
        </div>
      )}
    </div>
  );
}
