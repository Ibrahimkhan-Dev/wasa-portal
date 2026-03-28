import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home',             href: '/' },
  { label: 'View Bill',        href: '/bill' },
  { label: 'Submit Complaint', href: '/complaint' },
  { label: 'Verify Staff',     href: '/verify' },
  { label: 'Announcements',    href: '/notices' },
  { label: 'Contact Us',       href: '/contact' },
];

const PUBLIC_SERVICES = [
  { label: 'Bill Inquiry',         href: '/bill' },
  { label: 'Complaint Submission', href: '/complaint' },
  { label: 'Staff Verification',   href: '/verify' },
  { label: 'Public Notices',       href: '/notices' },
  { label: 'Latest Insights',      href: '/insights' },
  { label: 'Staff Portal Login',   href: '/login' },
];

export function PublicFooter() {
  return (
    <footer className="bg-blue-950 text-white">
      {/* Top divider accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Column 1: Brand ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded-xl p-1.5">
                <Image src="/logo.png" alt="WASA Logo" fill className="object-contain p-0.5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-lg leading-none tracking-tight">WASA</p>
                <p className="text-blue-300 text-xs mt-0.5">Water & Sanitation Authority</p>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-6">
              Providing clean water and sanitation services to citizens of Lahore with transparency, efficiency, and dignity.
            </p>
            {/* Trust seal */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-900 border border-blue-700 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-white leading-none">Verified Government Service</p>
                <p className="text-xs text-blue-400 mt-0.5">Government of Punjab, Pakistan</p>
              </div>
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-300 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Public Services ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Public Services</h4>
            <ul className="space-y-2.5">
              {PUBLIC_SERVICES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-300 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact & Hours</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-blue-300">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <span>WASA Head Office, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-300">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>042-111-WASA-PK</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-300">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>info@wasa.gov.pk</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-blue-300">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p>Mon – Fri: 9:00 AM – 5:00 PM</p>
                  <p className="text-emerald-400 font-medium mt-0.5">Helpline: 24 / 7</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-blue-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-blue-400">
            &copy; {new Date().getFullYear()} WASA Smart Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-blue-500">
            <Link href="/privacy" className="hover:text-blue-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms"   className="hover:text-blue-300 transition-colors">Terms of Use</Link>
            <span>·</span>
            <span>Government of Punjab, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
