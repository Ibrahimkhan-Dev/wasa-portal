'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, Receipt, MessageSquare, UserCheck,
  Upload, TrendingUp, ChevronRight, ArrowUpRight,
  AlertCircle, CheckCircle2, Clock, Loader2,
} from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardStats {
  stats: {
    totalConsumers:   number;
    activeEmployees:  number;
    pendingComplaints:number;
    totalBills:       number;
  };
  recentBatches: Array<{
    id:             string;
    batchName:      string;
    billingMonth:   string;
    status:         string;
    successfulRows: number;
    failedRows:     number;
    uploadedAt:     string;
    uploadedByUser: { fullName: string };
  }>;
  recentComplaints: Array<{
    id:             string;
    complaintNumber:string;
    subject:        string;
    status:         string;
    priority:       string;
    submittedAt:    string;
    consumer?: { fullName: string; consumerNumber: string };
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatLongDate() {
  return new Date().toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY ICON
// ─────────────────────────────────────────────────────────────────────────────

function PriorityDot({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    urgent:   'bg-red-500',
    high:     'bg-orange-500',
    medium:   'bg-amber-400',
    low:      'bg-emerald-500',
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${map[priority] ?? 'bg-gray-400'}`}
      title={priority}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  subtitle,
  linkHref,
  linkLabel,
  children,
}: {
  icon:       React.ReactNode;
  title:      string;
  subtitle:   string;
  linkHref:   string;
  linkLabel:  string;
  children:   React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-none">{title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <Link
          href={linkHref}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {linkLabel}
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-50">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-3 w-40 bg-gray-100 rounded-full" />
              <div className="h-2.5 w-28 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
            <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="px-6 py-14 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">{desc}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Add Consumer',     href: '/dashboard/consumers/add', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',    icon: <Users       className="w-4 h-4" /> },
  { label: 'Upload Bills',     href: '/dashboard/billing',       color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', icon: <Upload     className="w-4 h-4" /> },
  { label: 'View Complaints',  href: '/dashboard/complaints',    color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'View Reports',     href: '/dashboard/reports',       color: 'bg-violet-50 text-violet-700 hover:bg-violet-100', icon: <TrendingUp className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user }  = useAuth();
  const [data,    setData]    = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>('/reports/dashboard')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── WELCOME BANNER ── */}
      <div
        className="relative rounded-2xl overflow-hidden text-white p-6"
        style={{ background: 'linear-gradient(135deg, #0f1f42 0%, #1a3a7a 60%, #1d4ed8 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm font-medium">{timeGreeting()},</p>
            <h2 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">{firstName}</h2>
            <p className="text-blue-200 text-sm mt-1.5 max-w-md leading-relaxed">
              Here is what is happening in your WASA system today.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
            <p className="text-blue-200 text-xs font-medium">{formatLongDate()}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Consumers"
          value={loading ? 0 : (data?.stats.totalConsumers ?? 0)}
          icon={<Users className="w-5 h-5" />}
          accent="blue"
          subtitle="Registered accounts"
          loading={loading}
        />
        <StatCard
          title="Active Employees"
          value={loading ? 0 : (data?.stats.activeEmployees ?? 0)}
          icon={<UserCheck className="w-5 h-5" />}
          accent="green"
          subtitle="Staff on record"
          loading={loading}
        />
        <StatCard
          title="Pending Complaints"
          value={loading ? 0 : (data?.stats.pendingComplaints ?? 0)}
          icon={<MessageSquare className="w-5 h-5" />}
          accent="yellow"
          subtitle="Awaiting assignment"
          loading={loading}
        />
        <StatCard
          title="Total Bills"
          value={loading ? 0 : (data?.stats.totalBills ?? 0)}
          icon={<Receipt className="w-5 h-5" />}
          accent="purple"
          subtitle="All generated bills"
          loading={loading}
        />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm ${action.color}`}
          >
            {action.icon}
            {action.label}
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </Link>
        ))}
      </div>

      {/* ── TABLES ROW ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Recent Billing Uploads */}
        <SectionCard
          icon={<Upload className="w-4 h-4 text-blue-600" />}
          title="Recent Billing Uploads"
          subtitle="Latest batch activity"
          linkHref="/dashboard/billing"
          linkLabel="View all"
        >
          {loading ? (
            <TableSkeleton />
          ) : !data?.recentBatches.length ? (
            <EmptyState
              icon={<Upload className="w-6 h-6 text-gray-300" />}
              title="No billing uploads yet"
              desc="Upload a billing batch to see recent activity here."
            />
          ) : (
            <div className="divide-y divide-gray-50">
              {data.recentBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Upload className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                        {batch.batchName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {batch.billingMonth} &middot; {batch.uploadedByUser.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-4">
                    <StatusBadge status={batch.status} />
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {batch.successfulRows}
                      {batch.failedRows > 0 && (
                        <>
                          <span className="mx-0.5">·</span>
                          <AlertCircle className="w-3 h-3 text-red-400" />
                          {batch.failedRows}
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">{formatDate(batch.uploadedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Recent Complaints */}
        <SectionCard
          icon={<TrendingUp className="w-4 h-4 text-violet-600" />}
          title="Recent Complaints"
          subtitle="Latest citizen submissions"
          linkHref="/dashboard/complaints"
          linkLabel="View all"
        >
          {loading ? (
            <TableSkeleton />
          ) : !data?.recentComplaints.length ? (
            <EmptyState
              icon={<MessageSquare className="w-6 h-6 text-gray-300" />}
              title="No complaints yet"
              desc="Submitted complaints will appear here for quick review."
            />
          ) : (
            <div className="divide-y divide-gray-50">
              {data.recentComplaints.map((c) => (
                <div
                  key={c.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-violet-700 transition-colors">
                          {c.subject}
                        </p>
                        <PriorityDot priority={c.priority} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {c.complaintNumber}
                        {c.consumer && ` · ${c.consumer.fullName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-4">
                    <StatusBadge status={c.status} />
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(c.submittedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── LOADING OVERLAY (full page) ── */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}
