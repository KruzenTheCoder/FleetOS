import './globals.css';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseProvider } from '@/components/SupabaseProvider';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'FleetOS — Pro Suite',
  description: 'Live Fleet Command',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={inter.className}>
      <body className="font-sans antialiased text-slate-900">
        <SupabaseProvider session={session}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}