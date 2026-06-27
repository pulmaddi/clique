import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

export type Profile = {
  id: string;
  name: string | null;
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
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  email: null,
  profile: null,
  loading: true,
  refresh: async () => {},
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
      .select('id,name,language,city,state')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
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
