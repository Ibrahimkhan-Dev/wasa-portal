import { clsx } from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// BASE CARD
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  children:   React.ReactNode;
  className?: string;
  accent?:    'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const accentBorders = {
  blue:   'border-t-blue-500',
  green:  'border-t-emerald-500',
  red:    'border-t-red-500',
  yellow: 'border-t-amber-500',
  purple: 'border-t-violet-500',
};

export function Card({ children, className, accent }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
        accent && `border-t-4 ${accentBorders[accent]}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title:     string;
  value:     string | number;
  icon:      React.ReactNode;
  accent?:   'blue' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
  loading?:  boolean;
}

const ACCENT_CONFIG = {
  blue: {
    topBar:  'from-blue-500 to-blue-600',
    iconBg:  'from-blue-500 to-blue-600',
    shadow:  'hover:shadow-blue-100',
    ring:    'ring-blue-100',
  },
  green: {
    topBar:  'from-emerald-500 to-emerald-600',
    iconBg:  'from-emerald-500 to-emerald-600',
    shadow:  'hover:shadow-emerald-100',
    ring:    'ring-emerald-100',
  },
  yellow: {
    topBar:  'from-amber-400 to-orange-500',
    iconBg:  'from-amber-400 to-orange-500',
    shadow:  'hover:shadow-amber-100',
    ring:    'ring-amber-100',
  },
  purple: {
    topBar:  'from-violet-500 to-purple-600',
    iconBg:  'from-violet-500 to-purple-600',
    shadow:  'hover:shadow-violet-100',
    ring:    'ring-violet-100',
  },
};

export function StatCard({ title, value, icon, accent = 'blue', subtitle, loading }: StatCardProps) {
  const cfg = ACCENT_CONFIG[accent];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2.5">
            <div className="h-3 w-28 bg-gray-200 rounded-full" />
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
            <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden',
        'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        cfg.shadow,
      )}
    >
      {/* Gradient top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cfg.topBar}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none mb-2">
              {title}
            </p>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
            )}
          </div>

          {/* Icon with gradient background */}
          <div
            className={clsx(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0',
              'shadow-lg bg-gradient-to-br',
              cfg.iconBg,
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
