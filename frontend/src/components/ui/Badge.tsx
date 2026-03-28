import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'orange';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-800',
};

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active: { label: 'Active', variant: 'green' },
    inactive: { label: 'Inactive', variant: 'gray' },
    suspended: { label: 'Suspended', variant: 'red' },
    blocked: { label: 'Blocked', variant: 'red' },
    paid: { label: 'Paid', variant: 'green' },
    unpaid: { label: 'Unpaid', variant: 'red' },
    overdue: { label: 'Overdue', variant: 'orange' },
    partially_paid: { label: 'Partial', variant: 'yellow' },
    cancelled: { label: 'Cancelled', variant: 'gray' },
    pending: { label: 'Pending', variant: 'yellow' },
    assigned: { label: 'Assigned', variant: 'blue' },
    in_progress: { label: 'In Progress', variant: 'blue' },
    resolved: { label: 'Resolved', variant: 'green' },
    closed: { label: 'Closed', variant: 'gray' },
    rejected: { label: 'Rejected', variant: 'red' },
  };

  const config = map[status] || { label: status, variant: 'gray' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
