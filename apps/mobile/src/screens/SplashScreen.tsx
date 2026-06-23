import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { t } from '../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => navigation.replace('Welcome'), 1400);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🪔</Text>
      <Text style={styles.name}>{t('appName')}</Text>
      <Text style={styles.tag}>{t('tagline')}</Text>
      <Text style={styles.langs}>English · हिन्दी · తెలుగు</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { fontSize: 64 },
  name: { color: colors.white, fontSize: 28, fontWeight: '700', marginTop: 12 },
  tag: { color: colors.cream, fontSize: 13, marginTop: 4, opacity: 0.9 },
  langs: { color: colors.cream, fontSize: 11, position: 'absolute', bottom: 40, opacity: 0.8 },
});
