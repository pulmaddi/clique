import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  te: 'తెలుగు',
};

export default function MyProfileScreen() {
  const { profile, email } = useAuth();

  const rows: { label: string; value: string }[] = [
    { label: t('myProfile.name'), value: profile?.name?.trim() || '—' },
    { label: t('myProfile.email'), value: email || '—' },
    {
      label: t('myProfile.language'),
      value: LANG_LABEL[profile?.language ?? 'en'] ?? 'English',
    },
    {
      label: t('myProfile.location'),
      value:
        [profile?.city, profile?.state].filter(Boolean).join(', ') || '—',
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.hint}>{t('myProfile.subtitle')}</Text>
      <View style={styles.card}>
        {rows.map((r, i) => (
          <View key={r.label}>
            {i > 0 && <View style={styles.divider} />}
            <View style={styles.row}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  body: { padding: spacing.lg },
  hint: { fontSize: 13, color: colors.muted, marginBottom: 14 },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: { paddingVertical: 14, paddingHorizontal: 16 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 3 },
  value: { fontSize: 15, color: colors.ink, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.line },
});
