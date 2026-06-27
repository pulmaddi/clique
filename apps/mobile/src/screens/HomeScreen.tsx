import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted, Button, LiveBadge } from '../components/ui';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const fullName = profile?.name?.trim() || t('profile.devotee');
  const firstName = fullName.split(' ')[0];
  const initial = (firstName[0] || '🙏').toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.greet}>🙏 {t('namaste')}, {firstName}</Text>
          {!!profile?.city && <Text style={styles.loc}>📍 {profile.city}</Text>}
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel={t('tabs.profile')}
        >
          <Text style={{ color: colors.white, fontWeight: '700' }}>{initial}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <TextInput
          style={styles.search}
          placeholder="🔍 Search temples, Gurus, groups…"
          placeholderTextColor={colors.muted}
        />

        <Card style={styles.liveCard}>
          <LiveBadge />
          <Title>Evening Aarti — Sri Venkateswara</Title>
          <Muted>2,140 watching · Telugu</Muted>
          <Button label={t('common.join')} />
        </Card>

        <Text style={styles.section}>{t('home.upcoming')}</Text>
        <Card>
          <Title>Weekly Satsang — Swami Anand</Title>
          <Muted>Sun 7:00 PM · Subscriber</Muted>
        </Card>
        <Card>
          <Title>Navaratri Special Puja</Title>
          <Muted>Fri 6:30 PM · ₹151</Muted>
        </Card>

        <Text style={styles.section}>{t('home.following')}</Text>
        <View style={styles.chips}>
          {['🛕 Sri Venkateswara', '🧘 Swami Anand', '👥 Bhakti Mandali'].map(
            (x) => (
              <View key={x} style={styles.chip}>
                <Text style={styles.chipText}>{x}</Text>
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: {
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  greet: { color: colors.white, fontSize: 14, fontWeight: '600' },
  loc: { color: colors.cream, fontSize: 11, opacity: 0.85 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg },
  search: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 13,
  },
  liveCard: { backgroundColor: '#FFF7EF', borderColor: '#F0D3AD' },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 16,
    marginBottom: 4,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { fontSize: 11, color: '#5b4a38' },
});
