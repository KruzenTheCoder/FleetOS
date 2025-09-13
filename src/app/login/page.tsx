'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/shared/Spinner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/10 to-indigo-100 p-4">
      <form onSubmit={signIn} className="glass p-8 w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo.svg" alt="FleetOS" width={48} height={48} />
          <h1 className="text-2xl font-bold">FleetOS</h1>
        </div>
        <input type="text" placeholder="Username" className="input" />
        <input type="password" placeholder="Password" className="input" />
        <button
          type="submit"
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-xl shadow-soft hover:brightness-95 transition"
        >
          Sign In
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <Spinner className="w-20 h-20" />
          <p className="mt-4 text-brand font-semibold">Preparing dashboard...</p>
        </div>
      )}
    </div>
  );
}
