'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, User, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB HELPER
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_NAMES: Record<string, string> = {
  dashboard:  'Dashboard',
  consumers:  'Consumers',
  billing:    'Billing',
  employees:  'Employees',
  qr:         'QR Profiles',
  complaints: 'Complaints',
  reports:    'Reports',
  notices:    'Notices',
  users:      'Users',
  settings:   'Settings',
  add:        'Add New',
  profile:    'My Profile',
};

function Breadcrumb() {
  const pathname = usePathname();
  const parts    = pathname.replace(/^\//, '').split('/').filter(Boolean);

  if (parts.length <= 1) return null;

  return (
    <nav className="hidden sm:flex items-center gap-1 text-sm text-gray-400 ml-3">
      {parts.map((part, i) => {
        const isLast  = i === parts.length - 1;
        const name    = ROUTE_NAMES[part] ?? part;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            <span className={isLast ? 'text-gray-700 font-semibold' : 'text-gray-400'}>{name}</span>
          </span>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow-md flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
    >
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────

export function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout }  = useAuth();
  const router            = usePathname();
  const routerNav         = useRouter();

  const handleLogout = async () => {
    await logout();
    routerNav.push('/login');
  };

  // Current section name
  const pathParts   = router.replace(/^\//, '').split('/').filter(Boolean);
  const sectionName = ROUTE_NAMES[pathParts[pathParts.length - 1]] ?? 'Dashboard';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.06)' }}
    >
      {/* ── Left: page title + breadcrumb ── */}
      <div className="flex items-center gap-1">
        <h1 className="text-base font-bold text-gray-900">{sectionName}</h1>
        <Breadcrumb />
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2">

        {/* Notification button */}
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            <Avatar name={user?.fullName ?? 'U'} />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.fullName}</p>
              <p className="text-[11px] text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

              {/* Dropdown panel */}
              <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-scale-in overflow-hidden">

                {/* Profile header */}
                <div className="px-4 pt-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.fullName ?? 'U'} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full capitalize">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); routerNav.push('/dashboard/profile'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    My Account
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); routerNav.push('/dashboard/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
