import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as AuthUser, Session } from '@supabase/supabase-js';
import type { User } from '../types/index.ts';
import { isSupabaseConfigured, supabase } from '../lib/supabase.ts';

interface RegisterResult {
  success: boolean;
  needsEmailConfirmation: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, dietaryPrefs: string[], newsletterOptIn: boolean) => Promise<RegisterResult>;
  updateUserPrefs: (prefs: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(authUser: AuthUser, profile: Record<string, unknown> | null): User {
  const metadata = authUser.user_metadata ?? {};
  const roleValue = profile?.role;
  const role: User['role'] = roleValue === 'admin' || roleValue === 'editor' ? roleValue : 'user';
  const statusValue = profile?.status;
  const status: User['status'] = statusValue === 'suspended' || statusValue === 'deleted' ? statusValue : 'active';

  return {
    id: authUser.id,
    email: String(profile?.email ?? authUser.email ?? ''),
    name: String(profile?.name ?? metadata.name ?? ''),
    role,
    status,
    avatarUrl: typeof profile?.avatar_url === 'string' ? profile.avatar_url : undefined,
    dietaryPrefs: Array.isArray(profile?.dietary_prefs)
      ? profile.dietary_prefs.filter((value): value is string => typeof value === 'string')
      : Array.isArray(metadata.dietary_prefs) ? metadata.dietary_prefs.filter((value: unknown): value is string => typeof value === 'string') : [],
    measurementUnit: profile?.measurement_unit === 'metric' ? 'metric' : 'us',
    newsletterOptIn: Boolean(profile?.newsletter_opt_in ?? metadata.newsletter_opt_in ?? false),
    createdAt: String(profile?.created_at ?? authUser.created_at ?? new Date().toISOString()),
    lastLoginAt: typeof profile?.last_login_at === 'string' ? profile.last_login_at : undefined,
  };
}

async function fetchProfile(authUser: AuthUser): Promise<User> {
  if (!supabase) return mapProfile(authUser, null);
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,name,role,status,avatar_url,dietary_prefs,measurement_unit,newsletter_opt_in,created_at,last_login_at')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    console.error('Unable to load Supabase profile:', error.message);
    return mapProfile(authUser, null);
  }
  return mapProfile(authUser, data as Record<string, unknown> | null);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const applySession = async (session: Session | null) => {
      setToken(session?.access_token ?? null);
      if (!session?.user) {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      const profile = await fetchProfile(session.user);
      if (active) {
        setUser(profile);
        setIsLoading(false);
      }
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore Supabase session:', error.message);
      void applySession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer profile reads so they don't run inside the Auth client's internal lock.
      queueMicrotask(() => { void applySession(session); });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      if (error) console.error('Supabase sign-in failed:', error.message);
      return false;
    }
    setToken(data.session?.access_token ?? null);
    setUser(await fetchProfile(data.user));
    return true;
  };

  const logout = () => {
    if (supabase) void supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    dietaryPrefs: string[],
    newsletterOptIn: boolean
  ): Promise<RegisterResult> => {
    if (!supabase) return { success: false, needsEmailConfirmation: false };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login',
        data: { name: name.trim(), dietary_prefs: dietaryPrefs, newsletter_opt_in: newsletterOptIn },
      },
    });
    if (error || !data.user) {
      if (error) console.error('Supabase sign-up failed:', error.message);
      return { success: false, needsEmailConfirmation: false };
    }

    if (data.session) {
      setToken(data.session.access_token);
      setUser(await fetchProfile(data.user));
      return { success: true, needsEmailConfirmation: false };
    }
    return { success: true, needsEmailConfirmation: true };
  };

  const updateUserPrefs = (prefs: string[]) => {
    if (!user) return;
    const updated = { ...user, dietaryPrefs: prefs };
    setUser(updated);
    if (supabase) {
      void supabase.from('profiles').update({ dietary_prefs: prefs }).eq('id', user.id)
        .then(({ error }) => { if (error) console.error('Unable to update dietary preferences:', error.message); });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, updateUserPrefs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
