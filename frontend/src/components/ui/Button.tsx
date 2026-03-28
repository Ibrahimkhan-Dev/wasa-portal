'use client';

import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow',
    secondary: 'bg-white hover:bg-gray-50 text-blue-700 border border-blue-200',
    success: 'bg-green-700 hover:bg-green-800 text-white shadow-sm hover:shadow',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
