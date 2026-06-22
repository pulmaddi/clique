import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Button } from '../components/ui';
import { t } from '../i18n';
import { api } from '../api/client';
import { setAuthToken } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerify'>;

export default function OtpVerifyScreen({ route, navigation }: Props) {
  const { phone } = route.params;
  const [code, setCode] = useState('');

  const onVerify = async () => {
    try {
      const res = await api.verifyOtp(phone, code);
      if (res.token) setAuthToken(res.token);
    } catch {
      // scaffold: continue to app regardless
    }
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t('otp.title')}</Text>
      <Text style={styles.sub}>
        We sent a 6-digit code to <Text style={styles.bold}>{phone}</Text>
      </Text>
      <TextInput
        style={styles.code}
        placeholder="••••••"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        textAlign="center"
      />
      <Button label={t('otp.verify')} onPress={onVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, backgroundColor: colors.cream },
  h1: { fontSize: 20, fontWeight: '700', color: colors.maroon, marginTop: 20 },
  sub: { fontSize: 13, color: colors.muted, marginTop: 6 },
  bold: { fontWeight: '700', color: colors.ink },
  code: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    fontSize: 28,
    letterSpacing: 12,
    padding: 16,
    marginVertical: 24,
  },
});
