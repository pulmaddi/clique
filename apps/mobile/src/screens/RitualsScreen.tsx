import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { t } from '../i18n';

type Props = BottomTabScreenProps<MainTabParamList, 'Rituals'>;

const RITUALS = [
  { icon: '🪔', label: 'Aarti', sub: 'daily' },
  { icon: '🌸', label: 'Puja', sub: 'archana' },
  { icon: '🔥', label: 'Havan', sub: 'homam' },
  { icon: '🛕', label: 'Abhishekam', sub: '' },
  { icon: '📿', label: 'Japa', sub: 'chanting' },
  { icon: '🪷', label: 'Lakshmi Puja', sub: '' },
  { icon: '🐚', label: 'Satyanarayan', sub: '' },
  { icon: '🌺', label: 'Sankalp', sub: 'personal' },
  { icon: '✨', label: 'More', sub: '' },
];

export default function RitualsScreen(_props: Props) {
  const nav =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>🪔 {t('rituals.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.hint}>
          Book a guided ceremony — group or personal (with your sankalpa).
        </Text>
        <View style={styles.grid}>
          {RITUALS.map((r) => (
            <TouchableOpacity
              key={r.label}
              style={styles.tile}
              onPress={() =>
                nav.navigate('RitualBooking', {
                  occasionId: r.label,
                  title: r.label,
                })
              }
            >
              <Text style={styles.tileIcon}>{r.icon}</Text>
              <Text style={styles.tileLabel}>{r.label}</Text>
              {!!r.sub && <Text style={styles.tileSub}>{r.sub}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: { backgroundColor: colors.maroon, padding: spacing.lg },
  title: { color: colors.white, fontSize: 16, fontWeight: '700' },
  body: { padding: spacing.lg },
  hint: { fontSize: 12, color: colors.muted, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  tileIcon: { fontSize: 26 },
  tileLabel: { fontSize: 11, fontWeight: '600', color: '#5b4a38', marginTop: 6 },
  tileSub: { fontSize: 9, color: colors.muted },
});
