'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, Receipt, UserCheck, MessageSquare,
  BarChart2, Settings, QrCode, ShieldCheck, FileText,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// NAV STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  label:       string;
  href:        string;
  icon:        React.ReactNode;
  permission?: string;
}

interface NavGroup {
  label?: string;
  items:  NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Consumers',   href: '/dashboard/consumers',  icon: <Users          className="w-[18px] h-[18px]" />, permission: 'consumer.view' },
      { label: 'Billing',     href: '/dashboard/billing',    icon: <Receipt        className="w-[18px] h-[18px]" />, permission: 'billing.view' },
      { label: 'Employees',   href: '/dashboard/employees',  icon: <UserCheck      className="w-[18px] h-[18px]" />, permission: 'employee.view' },
      { label: 'QR Profiles', href: '/dashboard/qr',         icon: <QrCode         className="w-[18px] h-[18px]" />, permission: 'employee.manage' },
      { label: 'Complaints',  href: '/dashboard/complaints', icon: <MessageSquare  className="w-[18px] h-[18px]" />, permission: 'complaint.view' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Reports', href: '/dashboard/reports', icon: <BarChart2 className="w-[18px] h-[18px]" />, permission: 'reports.view' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Notices',  href: '/dashboard/notices',  icon: <FileText    className="w-[18px] h-[18px]" /> },
      { label: 'Users',    href: '/dashboard/users',    icon: <ShieldCheck className="w-[18px] h-[18px]" />, permission: 'user.view' },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings    className="w-[18px] h-[18px]" />, permission: 'settings.manage' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  permissions: string[];
}

export function Sidebar({ permissions }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Overlay backdrop (only visible when expanded, on smaller screens it dims content) ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 bg-black/10 pointer-events-none"
          aria-hidden
        />
      )}

      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={clsx(
          'flex flex-col h-screen fixed left-0 top-0 z-40 overflow-hidden',
          'transition-all duration-300 ease-in-out',
          expanded ? 'w-64 shadow-2xl shadow-black/30' : 'w-16',
        )}
        style={{ background: 'linear-gradient(180deg, #0c1628 0%, #0f1f42 60%, #0c1628 100%)' }}
      >
        {/* ── Subtle inner right-edge glow ── */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent pointer-events-none" />

        {/* ── Logo ── */}
        <div
          className={clsx(
            'flex items-center gap-3 border-b border-white/8 flex-shrink-0',
            expanded ? 'px-5 py-4' : 'px-3.5 py-4 justify-center',
          )}
        >
          <div className="w-9 h-9 relative flex-shrink-0 bg-white/10 rounded-xl p-1.5">
            <Image src="/logo.png" alt="WASA" fill className="object-contain" />
          </div>
          <div
            className={clsx(
              'overflow-hidden transition-all duration-200',
              expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0',
            )}
          >
            <p className="font-extrabold text-white text-sm leading-tight tracking-tight whitespace-nowrap">WASA Portal</p>
            <p className="text-white/40 text-[10px] mt-0.5 leading-none whitespace-nowrap">Smart Administration</p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className={clsx('flex-1 overflow-y-auto py-4 space-y-0.5 overflow-x-hidden transition-all duration-300', expanded ? 'px-2' : 'px-1')}>
          {NAV_GROUPS.map((group, gi) => {
            const visibleItems = group.items.filter(
              (item) => !item.permission || permissions.includes(item.permission),
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={gi} className={gi > 0 ? (expanded ? 'pt-2' : 'pt-0') : ''}>
                {/* Group label — only shown when expanded */}
                {group.label && (
                  <div
                    className={clsx(
                      'overflow-hidden transition-all duration-200',
                      expanded ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <p className="px-3 py-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.18em] whitespace-nowrap">
                      {group.label}
                    </p>
                  </div>
                )}

                {/* Divider line — only shown when collapsed */}
                {group.label && !expanded && gi > 0 && (
                  <div className="mx-3 my-1 h-px bg-white/8" />
                )}

                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!expanded ? item.label : undefined}
                      className={clsx(
                        'relative flex items-center py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group',
                        expanded ? 'px-3 gap-3' : 'px-0 justify-center gap-0',
                        isActive
                          ? 'bg-white/12 text-white'
                          : 'text-white/55 hover:text-white hover:bg-white/7',
                      )}
                    >
                      {/* Icon */}
                      <span
                        className={clsx(
                          'flex-shrink-0 transition-colors duration-200',
                          isActive
                            ? 'text-blue-300'
                            : 'text-white/40 group-hover:text-white/80',
                        )}
                      >
                        {item.icon}
                      </span>

                      {/* Label — fades in when expanded */}
                      <span
                        className={clsx(
                          'whitespace-nowrap transition-all duration-200',
                          expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0',
                        )}
                      >
                        {item.label}
                      </span>

                      {/* Active right dot — only when expanded */}
                      {isActive && expanded && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      )}

                      {/* Active left highlight bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom brand strip — visible only when expanded ── */}
        <div
          className={clsx(
            'border-t border-white/8 flex-shrink-0 transition-all duration-200 overflow-hidden',
            expanded ? 'px-5 py-4 opacity-100' : 'px-0 py-0 opacity-0 h-0',
          )}
        >
          <p className="text-[10px] text-white/25 leading-relaxed">
            Water &amp; Sanitation Authority<br />
            Government of Punjab, Pakistan
          </p>
        </div>
      </aside>
    </>
  );
}
