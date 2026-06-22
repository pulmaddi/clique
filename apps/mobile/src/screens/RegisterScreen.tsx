import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Button } from '../components/ui';
import { t, setLocale } from '../i18n';
import { api } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
const LANGS: { code: 'en' | 'hi' | 'te'; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
];

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [lang, setLang] = useState<'en' | 'hi' | 'te'>('en');

  const onSendOtp = async () => {
    const full = `+91${phone.replace(/\D/g, '')}`;
    try {
      await api.requestOtp(full);
    } catch {
      // For the scaffold we proceed to OTP screen regardless (dev OTP logged by API).
    }
    navigation.navigate('OtpVerify', { phone: full });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🪔</Text>
      <Text style={styles.h1}>{t('register.title')}</Text>
      <Text style={styles.sub}>{t('register.subtitle')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('register.fullName')}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.phoneRow}>
        <Text style={styles.cc}>🇮🇳 +91</Text>
        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder={t('register.mobile')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <Text style={styles.label}>{t('register.language')}</Text>
      <View style={styles.chips}>
        {LANGS.map((l) => (
          <TouchableOpacity
            key={l.code}
            style={[styles.chip, lang === l.code && styles.chipOn]}
            onPress={() => {
              setLang(l.code);
              setLocale(l.code);
            }}
          >
            <Text style={[styles.chipText, lang === l.code && styles.chipTextOn]}>
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button label={t('register.sendOtp')} onPress={onSendOtp} />
      <Button
        label={t('register.haveAccount')}
        variant="outline"
        onPress={onSendOtp}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, backgroundColor: colors.cream, flexGrow: 1 },
  logo: { fontSize: 40, textAlign: 'center', marginTop: 30 },
  h1: { fontSize: 22, fontWeight: '700', color: colors.maroon, marginTop: 12 },
  sub: { fontSize: 13, color: colors.muted, marginBottom: 16 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginVertical: 6,
    fontSize: 14,
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cc: { fontSize: 14, color: colors.ink },
  phoneInput: { flex: 1 },
  label: { fontSize: 12, color: colors.muted, marginTop: 12 },
  chips: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  chip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  chipOn: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  chipText: { color: colors.ink, fontSize: 13 },
  chipTextOn: { color: colors.white },
});
