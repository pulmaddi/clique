import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export type Deity = {
  key: string;
  display_name: string;
  image_path: string | null;
  audio_path: string | null;
};

// Fallback list if the deities table isn't set up yet (keeps the picker working).
const FALLBACK: Deity[] = [
  'Ganesha', 'Shiva', 'Vishnu', 'Venkateswara', 'Rama', 'Krishna',
  'Hanuman', 'Lakshmi', 'Durga', 'Saraswati', 'Subrahmanya', 'Ayyappa',
].map((n) => ({ key: n.toLowerCase(), display_name: n, image_path: null, audio_path: null }));

let cache: Deity[] | null = null;

/** Public URL for a file in the 'deities' Storage bucket. */
export function deityFileUrl(path: string | null | undefined): string | null {
  if (!path || !isSupabaseConfigured) return null;
  return supabase.storage.from('deities').getPublicUrl(path).data.publicUrl;
}
export const deityImageUrl = deityFileUrl;

/** Force the next useDeities()/load() to re-fetch (call after admin edits). */
export function clearDeitiesCache() {
  cache = null;
}

async function load(): Promise<Deity[]> {
  if (cache) return cache;
  if (!isSupabaseConfigured) return FALLBACK;
  const { data, error } = await supabase
    .from('deities')
    .select('key,display_name,image_path,audio_path')
    .order('sort_order', { ascending: true });
  cache = error || !data || data.length === 0 ? FALLBACK : (data as Deity[]);
  return cache;
}

export function useDeities() {
  const [deities, setDeities] = useState<Deity[]>(cache ?? FALLBACK);

  useEffect(() => {
    let active = true;
    load().then((d) => active && setDeities(d));
    return () => {
      active = false;
    };
  }, []);

  /** Resolve an image URL for a stored ishta_daiva value (matches name or key). */
  const imageUrlForName = (name: string | null | undefined): string | null => {
    if (!name) return null;
    const n = name.trim().toLowerCase();
    const match = deities.find(
      (d) => d.display_name.toLowerCase() === n || d.key === n,
    );
    return deityImageUrl(match?.image_path);
  };

  return { deities, imageUrlForName };
}
