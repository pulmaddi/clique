import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
      <View style={styles.logoCard}>
        <Image
          source={require('../../assets/ishta-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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
  logoCard: { backgroundColor: colors.white, borderRadius: 20, padding: 18 },
  logo: { width: 150, height: 150 },
  tag: { color: colors.cream, fontSize: 13, marginTop: 16, opacity: 0.9 },
  langs: { color: colors.cream, fontSize: 11, position: 'absolute', bottom: 40, opacity: 0.8 },
});
