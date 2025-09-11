import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700'] });

export const metadata = {
  title: 'FleetOS — Pro Suite',
  description: 'Live Fleet Command',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="font-sans antialiased text-slate-900">{children}</body>
    </html>
  );
}