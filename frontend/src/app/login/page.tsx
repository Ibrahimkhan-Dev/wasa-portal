'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2,
  ShieldCheck, Activity, Users, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft,
} from 'lucide-react';
import { api, setTokens } from '@/lib/api';
import { saveUser } from '@/lib/auth';
import { User } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// LEFT BRAND PANEL
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-blue-300" />,
    title: 'Secure Administration',
    desc:  'Role-based access control with full audit trail logging',
  },
  {
    icon: <Activity className="w-5 h-5 text-blue-300" />,
    title: 'Real-time Management',
    desc:  'Live billing, complaints, and consumer management dashboard',
  },
  {
    icon: <Users className="w-5 h-5 text-blue-300" />,
    title: 'Official Staff Portal',
    desc:  'Verified WASA employees only — secure and monitored access',
  },
];

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between relative overflow-hidden lg:w-[52%] p-12 xl:p-16">
      {/* ── Deep background layer ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020c24] via-[#061535] to-[#0c2255]" />

      {/* ── Blur orbs ── */}
      <div className="float-orb absolute top-[-80px] left-[-60px] w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="float-orb-delayed absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-96 h-96 rounded-full bg-blue-800/20 blur-[80px] pointer-events-none" />

      {/* ── Water ripple rings (centred on logo area) ── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[110%] max-w-[520px] opacity-[0.07] pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="250" cy="250" r="80"  stroke="white" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="150" stroke="white" strokeWidth="1" />
        <circle cx="250" cy="250" r="220" stroke="white" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="290" stroke="white" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="360" stroke="white" strokeWidth="0.4" />
      </svg>

      {/* ── Wave at bottom ── */}
      <svg
        viewBox="0 0 900 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 h-20 opacity-[0.08] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,60 C150,100 300,20 450,60 C600,100 750,30 900,60 L900,120 L0,120 Z" fill="white" />
        <path d="M0,80 C200,50 400,110 600,80 C750,60 850,90 900,80 L900,120 L0,120 Z" fill="white" opacity="0.5" />
      </svg>

      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Back to public site */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to public site
        </Link>

        {/* Centre: Logo + headline */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-20 h-20 relative bg-white/10 border border-white/15 rounded-2xl p-2 mb-8">
              <Image src="/logo.png" alt="WASA Logo" fill className="object-contain p-1" priority />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-200 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Secure Staff Administration Platform
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              WASA<br />
              <span className="text-blue-300">Smart Portal</span>
            </h1>
            <p className="text-blue-300 text-base leading-relaxed max-w-sm">
              Official digital administration platform for Water &amp; Sanitation Authority — Lahore, Punjab.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-4 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-700/40 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-blue-300 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="flex items-center gap-2 mt-8">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <p className="text-xs text-blue-400">Government of Punjab · ISO-27001 Compliant</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO ACCOUNTS (collapsible)
// ─────────────────────────────────────────────────────────────────────────────

function DemoAccounts() {
  const [open, setOpen] = useState(false);

  const accounts = [
    { email: 'superadmin@wasa.gov.pk', role: 'Super Admin' },
    { email: 'admin@wasa.gov.pk',      role: 'Admin' },
    { email: 'billing@wasa.gov.pk',    role: 'Billing Officer' },
  ];

  return (
    <div className="w-full max-w-[420px] mt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl text-sm text-blue-200 transition-all"
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          Demo Accounts
        </span>
        {open
          ? <ChevronUp   className="w-4 h-4 text-blue-400" />
          : <ChevronDown className="w-4 h-4 text-blue-400" />
        }
      </button>

      {open && (
        <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-xl animate-slide-up">
          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div key={acc.email} className="flex items-center justify-between">
                <span className="text-xs text-blue-200 font-medium">{acc.email}</span>
                <span className="text-xs text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">{acc.role}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
            <span className="text-xs text-blue-300">Password for all:</span>
            <code className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg">Wasa@1234</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────

function LoginForm() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<{
        accessToken:  string;
        refreshToken: string;
        user: User;
      }>('/auth/login', { email: email.trim(), password });

      setTokens(data.accessToken, data.refreshToken);
      saveUser(data.user);
      router.push(redirect);
    } catch (err: unknown) {
      const anyErr = err as { message?: string | string[] };
      const messages = anyErr?.message;
      const msg = Array.isArray(messages)
        ? messages[0]
        : typeof messages === 'string'
        ? messages
        : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Glass card */
    <div className="w-full max-w-[420px] bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] rounded-[28px] p-8 xl:p-9 shadow-2xl shadow-black/50 animate-scale-in">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-white mb-1.5">Welcome back</h2>
        <p className="text-sm text-blue-300 leading-relaxed">
          Access the WASA administration portal securely
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-400/30 rounded-xl mb-6">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-blue-200 uppercase tracking-widest mb-2">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
            <input
              type="email"
              placeholder="you@wasa.gov.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/8 border border-white/15 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/50 focus:bg-white/12 transition-all text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-blue-200 uppercase tracking-widest mb-2">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/8 border border-white/15 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/50 focus:bg-white/12 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer w-4 h-4 rounded border-white/25 bg-white/10 text-blue-500 focus:ring-blue-500/30 cursor-pointer"
              />
            </div>
            <span className="text-sm text-blue-300 group-hover:text-blue-200 transition-colors select-none">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:text-white transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none text-white font-extrabold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {/* Footer note */}
      <div className="mt-7 pt-5 border-t border-white/10">
        <p className="text-xs text-blue-400/70 text-center leading-relaxed">
          This portal is restricted to authorized WASA staff only.
          <br />Unauthorized access is a criminal offence.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020c24] via-[#071535] to-[#0c2251] flex">

      {/* ── Left brand panel ── */}
      <BrandPanel />

      {/* ── Thin vertical divider ── */}
      <div className="hidden lg:block w-px flex-shrink-0 bg-gradient-to-b from-transparent via-white/8 to-transparent" />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12 relative overflow-hidden">

        {/* Subtle background orb behind form on right side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="float-orb-delayed absolute top-1/3 -translate-y-1/2 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-700/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">

          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8 animate-slide-up">
            <div className="w-16 h-16 relative bg-white/10 border border-white/15 rounded-2xl p-2 mx-auto mb-4">
              <Image src="/logo.png" alt="WASA Logo" fill className="object-contain p-1" priority />
            </div>
            <h1 className="text-2xl font-extrabold text-white">WASA Portal</h1>
            <p className="text-blue-300 text-sm mt-1">Smart Administration System</p>
          </div>

          {/* Suspense boundary for useSearchParams */}
          <Suspense
            fallback={
              <div className="w-full max-w-[420px] bg-white/7 backdrop-blur-2xl border border-white/12 rounded-[28px] p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Demo accounts */}
          <DemoAccounts />

          {/* Public site link (mobile) */}
          <Link
            href="/"
            className="lg:hidden mt-6 flex items-center gap-1.5 text-sm text-blue-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
