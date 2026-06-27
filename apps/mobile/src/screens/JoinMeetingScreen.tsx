import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted, Button, LiveBadge } from '../components/ui';
import { t } from '../i18n';

const LIVE = [
  { id: 'occ-1', icon: '🪔', title: 'Evening Aarti — Sri Venkateswara', meta: '2,140 watching · Telugu' },
  { id: 'occ-2', icon: '🧘', title: 'Satsang — Swami Anand', meta: '860 watching · Hindi' },
];

export default function JoinMeetingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [code, setCode] = useState('');

  const join = (id: string, title: string) =>
    nav.navigate('LiveMeeting', { occasionInstanceId: id, title });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>🎥 {t('joinMeeting.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>{t('joinMeeting.liveNow')}</Text>
        {LIVE.map((m) => (
          <Card key={m.id} style={styles.liveCard}>
            <View style={styles.row}>
              <View style={styles.thumb}>
                <Text style={{ fontSize: 20 }}>{m.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <LiveBadge />
                <Title>{m.title}</Title>
                <Muted>{m.meta}</Muted>
              </View>
            </View>
            <Button label={t('common.join')} onPress={() => join(m.id, m.title)} />
          </Card>
        ))}

        <Text style={styles.section}>{t('joinMeeting.haveCode')}</Text>
        <Card>
          <TextInput
            style={styles.input}
            placeholder={t('joinMeeting.codePlaceholder')}
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
          />
          <Button
            label={t('joinMeeting.joinByCode')}
            variant="green"
            onPress={() => join(`code-${code || 'demo'}`, t('joinMeeting.title'))}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: { backgroundColor: colors.maroon, padding: spacing.lg },
  title: { color: colors.white, fontSize: 16, fontWeight: '700' },
  body: { padding: spacing.lg },
  section: { fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 10, marginBottom: 4 },
  liveCard: { backgroundColor: '#FFF7EF', borderColor: '#F0D3AD' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    marginBottom: 4,
  },
});
