'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCubeOutline } from 'react-icons/io5';

import { HaloLoader } from '@/components/shared/HaloLoader';

import { LoadingBars } from '@/components/shared/LoadingBars';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/20 to-indigo-200 p-4 relative overflow-hidden">

      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
      <form onSubmit={signIn} className="glass relative z-10 p-8 md:p-10 w-full max-w-sm space-y-6">

      {/* soft gradient circles for background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>

      <form
        onSubmit={signIn}
        className="glass relative z-10 p-8 md:p-10 w-full max-w-sm space-y-6"
      >

        <div className="flex flex-col items-center gap-3">
          <div className="grad w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft">
            <IoCubeOutline className="text-brand text-3xl" />
          </div>
          <h1 className="text-2xl font-bold">FleetOS</h1>
        </div>

        <input type="text" placeholder="Username" className="input" />
        <input type="password" placeholder="Password" className="input" />


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
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md z-50 animate-fade">
          <HaloLoader />
        </div>
      )}
      <style jsx>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade { animation: fade .3s ease forwards; }


      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-white/30 z-50 animate-fade">
          <LoadingBars className="w-24 h-24" />
          <p className="mt-4 text-brand font-semibold">Preparing dashboard...</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade {
          animation: fade 0.3s ease forwards;
        }

      `}</style>
    </div>
  );
}
