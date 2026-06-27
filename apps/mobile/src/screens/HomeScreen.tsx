import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted, Button } from '../components/ui';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';
import { useDeities } from '../lib/deities';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile } = useAuth();
  const { imageUrlForName } = useDeities();
  const deityImg = imageUrlForName(profile?.ishta_daiva);
  const fullName = profile?.name?.trim() || t('profile.devotee');
  const firstName = fullName.split(' ')[0];
  const initial = (firstName[0] || '🙏').toUpperCase();

  const practices: { icon: string; label: string; onPress: () => void }[] = [
    { icon: '🪔', label: t('home.todaysPooja'), onPress: () => navigation.navigate('TodaysPuja') },
    { icon: '🌺', label: t('home.vratha'), onPress: () => navigation.navigate('TodaysPuja') },
    { icon: '📿', label: t('home.japa'), onPress: () => navigation.navigate('TodaysPuja') },
    { icon: '📜', label: t('home.slokas'), onPress: () => navigation.navigate('TodaysPuja') },
  ];

  const groups = [
    { icon: '🧘', name: 'Swami Anand', meta: 'Guru · Hindi · Rishikesh' },
    { icon: '👥', name: 'Bhakti Mandali', meta: 'Group · Telugu · Vijayawada' },
  ];
  const temples = [
    { icon: '🛕', name: 'Sri Venkateswara Temple', meta: 'Temple · Telugu · Hyderabad' },
    { icon: '🛕', name: 'ISKCON Bengaluru', meta: 'Temple · English/Hindi' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.greet}>🙏 {t('namaste')}, {firstName}</Text>
          {!!profile?.city && <Text style={styles.loc}>📍 {profile.city}</Text>}
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => rootNav.navigate('Profile')}
          accessibilityLabel={t('tabs.profile')}
        >
          <Text style={{ color: colors.white, fontWeight: '700' }}>{initial}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Featured: Ishta Daiva Pooja */}
        <TouchableOpacity
          style={styles.featured}
          activeOpacity={0.85}
          onPress={() =>
            profile?.ishta_daiva
              ? rootNav.navigate('Pooja')
              : rootNav.navigate('MyProfile')
          }
        >
          {deityImg ? (
            <Image source={{ uri: deityImg }} style={styles.featuredImg} resizeMode="cover" />
          ) : (
            <Text style={styles.featuredIcon}>🕉️</Text>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredTitle}>{t('home.ishtaDaivaPooja')}</Text>
            <Text style={styles.featuredSub}>
              {profile?.ishta_daiva
                ? `${t('home.forYour')} ${profile.ishta_daiva} 🙏`
                : t('home.setIshtaDaiva')}
            </Text>
          </View>
          <Text style={styles.featuredArrow}>›</Text>
        </TouchableOpacity>

        {/* Daily practices */}
        <Text style={styles.section}>{t('home.dailyPractices')}</Text>
        <View style={styles.grid}>
          {practices.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={styles.tile}
              onPress={p.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.tileIconWrap}>
                <Text style={styles.tileIcon}>{p.icon}</Text>
              </View>
              <Text style={styles.tileLabel}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spiritual groups */}
        <View style={styles.sectionHdr}>
          <Text style={styles.section}>🧘 {t('home.spiritualGroups')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JoinCommunity')}>
            <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        {groups.map((g) => (
          <Card key={g.name}>
            <View style={styles.row}>
              <View style={styles.thumb}><Text style={styles.thumbIcon}>{g.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Title>{g.name}</Title>
                <Muted>{g.meta}</Muted>
              </View>
            </View>
            <Button label={t('home.join')} onPress={() => navigation.navigate('JoinCommunity')} />
          </Card>
        ))}

        {/* Temple communities */}
        <View style={styles.sectionHdr}>
          <Text style={styles.section}>🛕 {t('home.templeCommunity')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JoinCommunity')}>
            <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        {temples.map((tm) => (
          <Card key={tm.name}>
            <View style={styles.row}>
              <View style={styles.thumb}><Text style={styles.thumbIcon}>{tm.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Title>{tm.name}</Title>
                <Muted>{tm.meta}</Muted>
              </View>
            </View>
            <Button label={t('home.join')} onPress={() => navigation.navigate('JoinCommunity')} />
          </Card>
        ))}
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
  greet: { color: colors.white, fontSize: 15, fontWeight: '600' },
  loc: { color: colors.cream, fontSize: 11, opacity: 0.85 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg, paddingBottom: 30 },
  section: { fontSize: 15, fontWeight: '700', color: colors.ink },
  featured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.maroon,
    borderRadius: radius.lg,
    padding: 16,
  },
  featuredIcon: { fontSize: 30 },
  featuredImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  featuredTitle: { color: colors.white, fontSize: 16, fontWeight: '800' },
  featuredSub: { color: colors.cream, fontSize: 12, opacity: 0.9, marginTop: 2 },
  featuredArrow: { color: colors.white, fontSize: 24, opacity: 0.8 },
  sectionHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 4,
  },
  seeAll: { fontSize: 12, color: colors.saffron, fontWeight: '600' },
  // practice grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tile: {
    width: '48%',
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  tileIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon: { fontSize: 28 },
  tileLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 10,
  },
  // cards
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: { fontSize: 20 },
});
