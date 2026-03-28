import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WASA Smart Portal',
  description: 'Water and Sanitation Authority - Smart Portal for Consumer Services and Administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
