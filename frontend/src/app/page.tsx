'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Receipt, MessageSquare, ShieldCheck, Bell, ArrowRight, Search,
  ChevronRight, ChevronLeft, ChevronDown, Phone, Mail, MapPin,
  Shield, Clock, CheckCircle, Users, AlertTriangle, Info, Megaphone,
  LogIn,
} from 'lucide-react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Water Conservation',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'Save Water, Save Life: Essential Tips for Every Household',
    excerpt: 'Discover practical ways to reduce water consumption at home and contribute to a sustainable future for our city.',
    date: 'March 20, 2026',
    readTime: '4 min read',
    gradient: 'from-blue-700 to-blue-400',
  },
  {
    id: 2,
    category: 'Billing Update',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    title: 'Understanding Your WASA Bill: A Complete Breakdown',
    excerpt: 'Learn how your monthly water bill is calculated, what each charge means, and how to dispute incorrect billing.',
    date: 'March 15, 2026',
    readTime: '6 min read',
    gradient: 'from-emerald-600 to-teal-400',
  },
  {
    id: 3,
    category: 'Infrastructure',
    categoryColor: 'bg-violet-100 text-violet-700',
    title: 'New Water Treatment Plant to Serve 500,000 Residents',
    excerpt: 'WASA announces completion of Phase 1 of the Ravi River water treatment expansion project ahead of schedule.',
    date: 'March 10, 2026',
    readTime: '5 min read',
    gradient: 'from-violet-600 to-purple-400',
  },
  {
    id: 4,
    category: 'Public Health',
    categoryColor: 'bg-rose-100 text-rose-700',
    title: 'Spring 2026 Water Quality Report: Analysis Results',
    excerpt: "WASA's independent lab analysis confirms water quality meets WHO standards across all major distribution zones.",
    date: 'March 5, 2026',
    readTime: '3 min read',
    gradient: 'from-rose-600 to-pink-400',
  },
  {
    id: 5,
    category: 'Community',
    categoryColor: 'bg-amber-100 text-amber-700',
    title: 'WASA Community Engagement Programme Launches in 12 New Areas',
    excerpt: 'Our field officers are now available in 12 additional neighbourhoods to assist with complaints and registrations.',
    date: 'Feb 28, 2026',
    readTime: '3 min read',
    gradient: 'from-amber-600 to-yellow-400',
  },
  {
    id: 6,
    category: 'Technology',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    title: 'Smart Meters Rollout: What Every Consumer Should Know',
    excerpt: 'WASA is deploying smart water meters across Lahore. Here is how the transition works and what to expect.',
    date: 'Feb 20, 2026',
    readTime: '5 min read',
    gradient: 'from-cyan-600 to-sky-400',
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'urgent',
    label: 'Urgent',
    labelColor: 'bg-red-100 text-red-700',
    borderColor: 'border-l-red-500',
    title: 'Scheduled Supply Shutdown — Johar Town & Gulberg (March 30)',
    summary:
      'Water supply will be suspended from 8:00 AM to 4:00 PM due to pipeline maintenance work. Please store sufficient water in advance.',
    date: 'March 28, 2026',
    featured: true,
  },
  {
    id: 2,
    type: 'advisory',
    label: 'Advisory',
    labelColor: 'bg-amber-100 text-amber-700',
    borderColor: 'border-l-amber-400',
    title: 'Revised Billing Cycle for April 2026',
    summary: 'Bills for April will be dispatched on the 5th. Consumers are advised to check the online portal for early access.',
    date: 'March 25, 2026',
    featured: false,
  },
  {
    id: 3,
    type: 'notice',
    label: 'Notice',
    labelColor: 'bg-blue-100 text-blue-700',
    borderColor: 'border-l-blue-400',
    title: 'New Online Complaint Portal Now Live',
    summary: 'Citizens can now file complaints 24/7 through our upgraded portal with real-time tracking support.',
    date: 'March 22, 2026',
    featured: false,
  },
  {
    id: 4,
    type: 'news',
    label: 'Public News',
    labelColor: 'bg-emerald-100 text-emerald-700',
    borderColor: 'border-l-emerald-400',
    title: 'Water Conservation Award Received by WASA Lahore',
    summary: 'WASA has been recognized by Punjab Environment Agency for best practices in water conservation 2025.',
    date: 'March 18, 2026',
    featured: false,
  },
];

const SERVICES = [
  {
    icon: <Receipt className="w-7 h-7" />,
    title: 'View Bill',
    description: 'Check and download your latest WASA water bill. View history and payment status instantly.',
    href: '/bill',
    accentBorder: 'border-t-blue-600',
    iconBg: 'bg-blue-600',
    ctaText: 'Check Bill',
    ctaBg: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    title: 'Lodge Complaint',
    description: 'Submit service or billing complaints and track resolution progress in real-time.',
    href: '/complaint',
    accentBorder: 'border-t-emerald-500',
    iconBg: 'bg-emerald-600',
    ctaText: 'Submit Complaint',
    ctaBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Verify Staff',
    description: 'Scan or enter a staff ID to verify official WASA employees before allowing entry.',
    href: '/verify',
    accentBorder: 'border-t-violet-500',
    iconBg: 'bg-violet-600',
    ctaText: 'Verify Now',
    ctaBg: 'bg-violet-600 hover:bg-violet-700',
  },
  {
    icon: <Bell className="w-7 h-7" />,
    title: 'Announcements',
    description: 'Stay updated with latest notices, supply schedules, and official billing advisories.',
    href: '/notices',
    accentBorder: 'border-t-amber-500',
    iconBg: 'bg-amber-500',
    ctaText: 'View Notices',
    ctaBg: 'bg-amber-500 hover:bg-amber-600',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Search className="w-5 h-5" />,
    title: 'Enter Consumer Number',
    desc: 'Type your consumer number printed on your WASA bill or connection letter.',
  },
  {
    step: '02',
    icon: <Receipt className="w-5 h-5" />,
    title: 'View or Submit Request',
    desc: 'Check your bill amount, payment history, or submit a service complaint with one click.',
  },
  {
    step: '03',
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Download, Track & Verify',
    desc: 'Download your bill as PDF, track complaint status, or verify WASA staff identity instantly.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do I find my consumer number?',
    a: 'Your consumer number is printed on every WASA bill, typically in the top-right corner. It is usually 8–12 digits long. If you cannot find it, contact our helpline at 042-111-WASA-PK.',
  },
  {
    q: 'Can I pay my bill online through this portal?',
    a: 'Currently the portal lets you view and download your bill. Online payment integration is coming soon. For now, you can pay at any bank branch, Easypaisa, or JazzCash using your consumer number.',
  },
  {
    q: 'How long does it take for a complaint to be resolved?',
    a: 'Standard complaints are addressed within 72 hours. Urgent supply issues are prioritised and typically resolved within 24 hours. Track your complaint status in real-time using your reference number.',
  },
  {
    q: 'How do I verify if a WASA worker visiting my home is genuine?',
    a: 'All official WASA staff carry a digital ID card. Scan the QR code on their ID or enter their staff ID on our Verify Staff page. Never allow entry to anyone who cannot be verified.',
  },
  {
    q: 'What if my bill shows an incorrect amount?',
    a: 'First download your bill and cross-check the meter reading. If there is a discrepancy, submit a billing complaint through this portal. Our billing team will review and correct it within 5 working days.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const outTimer  = setTimeout(() => setPhase('out'), 1200);
    const doneTimer = setTimeout(() => onDone(), 1700);
    return () => { clearTimeout(outTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-blue-950 flex items-center justify-center z-50">
      <div className={phase === 'in' ? 'logo-animate-in' : 'logo-animate-out'}>
        <div className="flex flex-col items-center gap-5">
          <div className="w-24 h-24 relative">
            <Image src="/logo.png" alt="WASA Logo" fill className="object-contain" priority />
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white tracking-tight">WASA</p>
            <p className="text-blue-300 text-sm mt-1">Smart Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = [
    { icon: <Clock      className="w-5 h-5 text-blue-600" />, title: '24/7 Helpline',             desc: 'Round-the-clock citizen support' },
    { icon: <Shield     className="w-5 h-5 text-blue-600" />, title: 'Official Government Service', desc: 'Verified & certified by GoP' },
    { icon: <CheckCircle className="w-5 h-5 text-blue-600"/>, title: 'Secure Complaint Tracking',  desc: 'Real-time status updates' },
    { icon: <Users      className="w-5 h-5 text-blue-600" />, title: 'Staff Verification',         desc: 'Know your WASA officer' },
  ];

  return (
    <section className="bg-white border-b border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED INSIGHTS SLIDER
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedInsights() {
  const sliderRef    = useRef<HTMLDivElement>(null);
  const [active, setActive]           = useState(0);
  const [isPlaying, setIsPlaying]     = useState(true);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxIndex = BLOG_POSTS.length - 3; // 0-3 for 6 posts showing 3 at a time

  const scrollToIndex = useCallback((idx: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.scrollWidth / BLOG_POSTS.length;
    sliderRef.current.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
    setActive(idx);
  }, []);

  const next = useCallback(() => {
    const nextIdx = active >= maxIndex ? 0 : active + 1;
    scrollToIndex(nextIdx);
  }, [active, maxIndex, scrollToIndex]);

  const prev = useCallback(() => {
    const prevIdx = active <= 0 ? maxIndex : active - 1;
    scrollToIndex(prevIdx);
  }, [active, maxIndex, scrollToIndex]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(next, 4000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, next]);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.scrollWidth / BLOG_POSTS.length;
    const idx = Math.round(sliderRef.current.scrollLeft / cardWidth);
    setActive(Math.min(idx, maxIndex));
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Public Awareness</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Latest Insights</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/insights" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
              View all articles <ChevronRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-scroll hide-scrollbar"
            onScroll={handleScroll}
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-[calc(33.333%-14px)] min-w-[280px] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image placeholder */}
                <div className={`h-44 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.categoryColor} bg-white/90`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 text-sm">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link href="/insights" className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:gap-2 transition-all">
                      Read more <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                active === i ? 'w-7 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function AnnouncementsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Supply Updates', 'Billing Notices', 'Public News'];
  const featured = ANNOUNCEMENTS.find((a) => a.featured)!;
  const others   = ANNOUNCEMENTS.filter((a) => !a.featured);

  const typeIcon = (type: string) => {
    if (type === 'urgent')   return <AlertTriangle className="w-3.5 h-3.5" />;
    if (type === 'advisory') return <Info           className="w-3.5 h-3.5" />;
    return                          <Megaphone      className="w-3.5 h-3.5" />;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Official Notices</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Announcements</h2>
          </div>
          <Link href="/notices" className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
            All notices <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured urgent notice */}
          <div className={`lg:col-span-3 rounded-2xl border-l-4 ${featured.borderColor} bg-white border border-gray-100 p-7 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${featured.labelColor} shimmer-urgent`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {featured.label} — Action Required
              </span>
              <span className="text-xs text-gray-400">{featured.date}</span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3 leading-snug">{featured.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{featured.summary}</p>
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              View Full Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stacked smaller notices */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {others.map((ann) => (
              <Link
                key={ann.id}
                href="/notices"
                className={`group flex items-start gap-4 p-4 rounded-xl border-l-4 ${ann.borderColor} border border-gray-100 bg-white hover:shadow-md transition-all hover:bg-gray-50/50`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${ann.labelColor}`}>
                      {typeIcon(ann.type)}
                      {ann.label}
                    </span>
                    <span className="text-xs text-gray-400">{ann.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{ann.title}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
              </Link>
            ))}
            <Link
              href="/notices"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:text-blue-700 hover:border-blue-400 transition-colors"
            >
              View all announcements <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">What We Offer</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Public Services</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            All WASA services are available online — no office visit required.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className={`group bg-white rounded-2xl border-t-4 ${s.accentBorder} border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {s.icon}
              </div>
              <h3 className="font-extrabold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.description}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${s.ctaBg} text-white text-xs font-bold rounded-xl group-hover:gap-3 transition-all`}>
                {s.ctaText} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="py-20 bg-blue-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-800/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-800/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Simple & Fast</p>
          <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
          <p className="text-blue-300 mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Access any WASA service in three simple steps — no account required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting dashes */}
          <div className="hidden md:block absolute top-[52px] left-[37%] right-[37%] h-px border-t-2 border-dashed border-blue-700 pointer-events-none" />
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-[88px] h-[88px] rounded-2xl bg-blue-900 border-2 border-blue-700 flex flex-col items-center justify-center shadow-lg shadow-blue-950/50">
                    <div className="text-blue-400 mb-0.5">{step.icon}</div>
                    <span className="text-2xl font-extrabold text-white leading-none">{step.step}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-950" />
                </div>
              </div>
              <h3 className="font-extrabold text-white mb-2">{step.title}</h3>
              <p className="text-blue-300 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────────────────────────────────────

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Help & Support</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-3 text-sm">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-blue-700 font-semibold hover:underline">Contact our helpline.</Link>
          </p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                openIndex === i ? 'border-blue-200 shadow-sm' : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180 text-blue-600' : 'text-gray-400'
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section className="py-20 bg-slate-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Get In Touch</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Contact & Support</h2>
          <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
            We&apos;re here to help. Reach us through any of the channels below.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Helpline</h3>
            <p className="text-blue-700 font-extrabold text-lg">042-111-WASA-PK</p>
            <p className="text-xs text-gray-500 mt-1">Available 24 / 7 for urgent issues</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
            <p className="text-emerald-700 font-extrabold">info@wasa.gov.pk</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Head Office</h3>
            <p className="text-gray-800 font-bold text-sm">WASA Lahore, Punjab</p>
            <p className="text-xs text-gray-500 mt-1">Mon – Fri: 9:00 AM – 5:00 PM</p>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Send Us a Message <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted]           = useState(false);
  const [splashDone, setSplashDone]     = useState(false);
  const [consumerNumber, setConsumerNumber] = useState('');
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleBillSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (consumerNumber.trim()) router.push(`/bill/${consumerNumber.trim()}`);
  };

  return (
    <>
      {mounted && !splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      <div className={mounted && !splashDone ? 'opacity-0 pointer-events-none' : 'content-zoom-in'}>
        <PublicNavbar />

        {/* ── HERO SECTION ── */}
        <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
          {/* Floating blur orbs */}
          <div className="float-orb absolute top-16 right-[8%] w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="float-orb-delayed absolute bottom-20 left-[5%] w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-800/30 blur-3xl pointer-events-none" />

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 relative bg-white/10 rounded-2xl p-2">
                <Image src="/logo.png" alt="WASA Logo" fill className="object-contain p-1" priority />
              </div>
            </div>

            {/* Headlines */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-700/50 border border-blue-600/40 rounded-full text-xs font-semibold text-blue-200 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Official WASA Digital Services Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Your Water.{' '}
              <span className="text-blue-300">Your Bill.</span>
              <br />
              <span className="text-emerald-400">Your Rights.</span>
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              View bills, verify staff, submit complaints, and access all public WASA services online — fast, secure, and available 24/7.
            </p>

            {/* Glass search card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-xl mx-auto shadow-2xl shadow-blue-950/40">
              <p className="text-blue-200 text-sm font-medium mb-4">Enter your consumer number to view your bill</p>
              <form onSubmit={handleBillSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    placeholder="e.g. 0123456789"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white text-blue-900 font-extrabold rounded-xl hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2 flex-shrink-0 shadow-lg"
                >
                  View Bill <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {[
                  { label: 'Lodge Complaint', href: '/complaint' },
                  { label: 'Verify Staff',    href: '/verify' },
                  { label: 'Read Notices',    href: '/notices' },
                  { label: 'Staff Login',     href: '/login' },
                ].map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-full transition-all"
                  >
                    {chip.label} <ChevronRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: <Shield      className="w-4 h-4 text-emerald-400" />, label: 'Official Government Service' },
                { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'SSL Secured Portal' },
                { icon: <Clock       className="w-4 h-4 text-emerald-400" />, label: '24/7 Helpline Active' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-blue-200">
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
            <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,10 1440,35 L1440,70 L0,70 Z" fill="white" />
            </svg>
          </div>

          {/* Bottom padding for wave overlap */}
          <div className="h-8 sm:h-12" />
        </section>

        {/* ── TRUST STRIP ── */}
        <TrustStrip />

        {/* ── FEATURED INSIGHTS ── */}
        <FeaturedInsights />

        {/* ── ANNOUNCEMENTS ── */}
        <AnnouncementsSection />

        {/* ── SERVICES ── */}
        <ServicesSection />

        {/* ── HOW IT WORKS ── */}
        <HowItWorks />

        {/* ── FAQ ── */}
        <FaqSection />

        {/* ── CONTACT ── */}
        <ContactSection />

        {/* ── FOOTER ── */}
        <PublicFooter />
      </div>
    </>
  );
}
