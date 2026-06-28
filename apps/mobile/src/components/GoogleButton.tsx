import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, radius } from '../theme';
import { signInWithGoogle, isSupabaseConfigured } from '../lib/supabase';
import { t } from '../i18n';

/**
 * "Continue with Google" button. Implemented for web (Supabase OAuth redirect).
 * Hidden on native for now (needs an in-app browser flow — follow-up).
 */
export default function GoogleButton({
  onError,
  disabled,
}: {
  onError?: (m: string) => void;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  if (Platform.OS !== 'web' || !isSupabaseConfigured) return null;

  const onPress = async () => {
    if (disabled) return;
    try {
      setBusy(true);
      await signInWithGoogle(); // redirects the page to Google
    } catch (e: any) {
      setBusy(false);
      onError?.(e?.message ?? 'Google sign-in failed.');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, (disabled || busy) && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || busy}
    >
      <Text style={styles.g}>G</Text>
      <Text style={styles.label}>{busy ? '…' : t('auth.google')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: 10,
  },
  disabled: { opacity: 0.45 },
  g: { color: '#4285F4', fontSize: 18, fontWeight: '800' },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
});
