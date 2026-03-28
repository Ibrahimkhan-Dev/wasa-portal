'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Receipt, LogIn } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'View Bill',   href: '/bill' },
  { label: 'Complaint',   href: '/complaint' },
  { label: 'Verify Staff',href: '/verify' },
  { label: 'Notices',     href: '/notices' },
  { label: 'Contact',     href: '/contact' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80'
          : 'bg-white border-b border-gray-200',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 relative flex-shrink-0">
              <Image src="/logo.png" alt="WASA Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="font-extrabold text-blue-900 text-base leading-none tracking-tight">WASA</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-none">Water & Sanitation Authority</p>
            </div>
          </Link>

          {/* ── Desktop Nav (centered) ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                    'after:content-[""] after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5',
                    'after:rounded-full after:transition-transform after:duration-300 after:origin-left',
                    active
                      ? 'text-blue-700 after:bg-blue-600 after:scale-x-100'
                      : 'text-gray-600 hover:text-blue-700 after:bg-blue-500 after:scale-x-0 hover:after:scale-x-100',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/bill"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-colors border border-blue-200"
            >
              <Receipt className="w-4 h-4" />
              View Bill
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Staff Login
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-sm px-4 py-4 space-y-1 animate-slide-down shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link
              href="/bill"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl border border-blue-200"
            >
              <Receipt className="w-4 h-4" />
              View Bill
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl"
            >
              <LogIn className="w-4 h-4" />
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
