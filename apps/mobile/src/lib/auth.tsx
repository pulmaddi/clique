import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { setLocale } from '../i18n';

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  ishta_daiva: string | null;
  language: string | null;
  city: string | null;
  state: string | null;
} | null;

type AuthState = {
  session: Session | null;
  email: string | null;
  profile: Profile;
  loading: boolean;
  refresh: () => Promise<void>;
  updateProfile: (patch: {
    name?: string;
    phone?: string;
    ishta_daiva?: string;
    city?: string;
    state?: string;
    language?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  email: null,
  profile: null,
  loading: true,
  refresh: async () => {},
  updateProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string | undefined) => {
    if (!userId || !isSupabaseConfigured) return setProfile(null);
    const { data } = await supabase
      .from('profiles')
      .select('id,name,phone,ishta_daiva,language,city,state')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    // Apply the user's saved language to the app.
    const lang = (data as Profile)?.language;
    if (lang === 'en' || lang === 'hi' || lang === 'te') setLocale(lang);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await fetchProfile(data.session?.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      void fetchProfile(s?.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      email: session?.user.email ?? null,
      profile,
      loading,
      refresh: () => fetchProfile(session?.user.id),
      updateProfile: async (patch) => {
        const uid = session?.user.id;
        if (!uid || !isSupabaseConfigured) return;
        const { error } = await supabase.from('profiles').update(patch).eq('id', uid);
        if (error) throw error;
        await fetchProfile(uid);
      },
      signOut: async () => {
        if (isSupabaseConfigured) await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
      },
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
