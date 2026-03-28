import { User } from '@/types';

export function saveUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('wasa_user', JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('wasa_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;
  return user.role === role;
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return ['Super Admin', 'Admin'].includes(user.role);
}

export function getDashboardPath(role: string): string {
  return '/dashboard';
}
