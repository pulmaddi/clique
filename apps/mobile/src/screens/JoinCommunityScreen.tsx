import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted, Button } from '../components/ui';
import { t } from '../i18n';

const COMMUNITIES = [
  { id: '1', icon: '🛕', name: 'Sri Venkateswara Temple', type: 'Temple · Telugu · Hyderabad', followers: '12,480' },
  { id: '2', icon: '🧘', name: 'Swami Anand', type: 'Guru · Hindi · Rishikesh', followers: '8,210' },
  { id: '3', icon: '👥', name: 'Bhakti Mandali', type: 'Group · Telugu · Vijayawada', followers: '3,540' },
  { id: '4', icon: '🛕', name: 'ISKCON Bengaluru', type: 'Temple · English/Hindi', followers: '21,900' },
  { id: '5', icon: '🪷', name: 'Lalitha Sahasranama Group', type: 'Group · Telugu', followers: '1,120' },
];

export default function JoinCommunityScreen() {
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setFollowed((s) => ({ ...s, [id]: !s[id] }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>👥 {t('joinCommunity.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <TextInput
          style={styles.search}
          placeholder={t('joinCommunity.search')}
          placeholderTextColor={colors.muted}
        />
        <Muted style={{ marginTop: 4 }}>{t('joinCommunity.subtitle')}</Muted>

        {COMMUNITIES.map((c) => (
          <Card key={c.id}>
            <View style={styles.row}>
              <View style={styles.thumb}>
                <Text style={{ fontSize: 20 }}>{c.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Title>{c.name}</Title>
                <Muted>{c.type}</Muted>
                <Muted>⭐ {c.followers} {t('joinCommunity.followers')}</Muted>
              </View>
            </View>
            <Button
              label={followed[c.id] ? t('joinCommunity.following') : t('joinCommunity.follow')}
              variant={followed[c.id] ? 'outline' : 'primary'}
              onPress={() => toggle(c.id)}
            />
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
  body: { padding: spacing.lg },
  search: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 13,
  },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
