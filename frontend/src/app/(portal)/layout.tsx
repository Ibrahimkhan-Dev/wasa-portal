'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/portal/Sidebar';
import { Topbar } from '@/components/portal/Topbar';
import { Loader2 } from 'lucide-react';
import { getStoredUser } from '@/lib/auth';
import { getAccessToken } from '@/lib/api';
import { User } from '@/types';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [user,     setUser]     = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token  = getAccessToken();
    const stored = getStoredUser();

    if (!token || !stored) {
      router.replace('/login');
    } else {
      setUser(stored);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* Sidebar is fixed-position and manages its own hover state */}
      <Sidebar permissions={user.permissions || []} />

      {/* Main content always offset by the collapsed sidebar width (w-16 = 4rem) */}
      <div className="ml-16 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
