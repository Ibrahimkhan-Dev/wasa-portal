'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { api, setTokens, clearTokens } from '@/lib/api';
import { saveUser, getStoredUser } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>('/auth/login', { email, password });

    setTokens(data.accessToken, data.refreshToken);
    saveUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('wasa_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch {}
    clearTokens();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await api.get<User>('/auth/me');
      saveUser(fresh);
      setUser(fresh);
      return fresh;
    } catch {
      return null;
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions.includes(permission) ?? false,
    [user],
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    hasPermission,
  };
}
