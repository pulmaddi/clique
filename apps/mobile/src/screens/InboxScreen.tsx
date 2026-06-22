import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted } from '../components/ui';
import { t } from '../i18n';

type Props = BottomTabScreenProps<MainTabParamList, 'Inbox'>;

const ITEMS = [
  { icon: '🛕', title: 'Sri Venkateswara Temple', body: '🌸 Special Navaratri darshan timings inside…', when: '2h' },
  { icon: '🧘', title: 'Swami Anand', body: 'Reminder: Satsang starts in 30 min 🙏', when: '5h' },
  { icon: '👥', title: 'Bhakti Mandali (Group)', body: 'New bhajan audio shared', when: '1d' },
  { icon: '✓', title: 'Payment receipt', body: 'Satyanarayan Puja · ₹252 · GST invoice', when: '1d' },
];

export default function InboxScreen(_props: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>🔔 {t('tabs.inbox')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {ITEMS.map((it) => (
          <Card key={it.title} style={styles.row}>
            <View style={styles.thumb}>
              <Text style={{ fontSize: 18, color: colors.white }}>{it.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Title>{it.title}</Title>
              <Muted>{it.body}</Muted>
            </View>
            <Muted>{it.when}</Muted>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: { backgroundColor: colors.maroon, padding: spacing.lg },
  title: { color: colors.white, fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  thumb: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
