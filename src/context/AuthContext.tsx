import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, dietaryPrefs: string[], newsletterOptIn: boolean) => Promise<boolean>;
  switchUser: (role: 'user' | 'admin' | 'guest') => void;
  updateUserPrefs: (prefs: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize with demo user Sarah Johnson by default for immediate rich exploration
    const stored = localStorage.getItem('hw_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setToken(`jwt-${parsed.id}`);
      } catch {
        setDefaultUser();
      }
    } else {
      setDefaultUser();
    }
    setIsLoading(false);
  }, []);

  const setDefaultUser = () => {
    const demo: User = {
      id: 'user-demo-1',
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      role: 'user',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      dietaryPrefs: ['High-Protein', 'Low-Sugar'],
      measurementUnit: 'us',
      newsletterOptIn: true,
      createdAt: '2026-09-01T10:00:00Z',
      lastLoginAt: '2026-10-19T14:30:00Z'
    };
    setUser(demo);
    setToken(`jwt-${demo.id}`);
    localStorage.setItem('hw_user', JSON.stringify(demo));
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('hw_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hw_user');
  };

  const register = async (name: string, email: string, dietaryPrefs: string[], newsletterOptIn: boolean): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, dietaryPrefs, newsletterOptIn })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('hw_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const switchUser = (target: 'user' | 'admin' | 'guest') => {
    if (target === 'guest') {
      logout();
      return;
    }
    if (target === 'admin') {
      const admin: User = {
        id: 'user-admin-1',
        email: 'admin@healthwiseusa.com',
        name: 'Dr. Alex Rivera, MS, RD',
        role: 'admin',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        dietaryPrefs: ['Mediterranean'],
        measurementUnit: 'us',
        newsletterOptIn: true,
        createdAt: '2026-08-15T08:00:00Z',
        lastLoginAt: '2026-10-19T20:15:00Z'
      };
      setUser(admin);
      setToken(`jwt-${admin.id}`);
      localStorage.setItem('hw_user', JSON.stringify(admin));
    } else {
      setDefaultUser();
    }
  };

  const updateUserPrefs = (prefs: string[]) => {
    if (!user) return;
    const updated = { ...user, dietaryPrefs: prefs };
    setUser(updated);
    localStorage.setItem('hw_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, switchUser, updateUserPrefs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
