import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Button } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Subscribe'>;

const TIERS = [
  { id: 'monthly', name: 'Monthly', price: '₹199', desc: 'All subscriber-only satsangs & discourses' },
  { id: 'yearly', name: 'Yearly · Save 30%', price: '₹1,699', desc: 'Everything monthly + priority ritual booking' },
];

const METHODS = [
  '🟣 UPI (GPay / PhonePe / Paytm)',
  '💳 Credit / Debit card',
  '🏦 Netbanking / Wallet',
];

export default function SubscribeScreen({ route }: Props) {
  const { hostName } = route.params;
  const [selected, setSelected] = useState('yearly');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>Subscribe</Text>
      <Text style={styles.muted}>Support {hostName} & unlock subscriber events.</Text>

      {TIERS.map((tier) => (
        <TouchableOpacity
          key={tier.id}
          style={[styles.tier, selected === tier.id && styles.tierSel]}
          onPress={() => setSelected(tier.id)}
        >
          <View style={styles.tierRow}>
            <Text style={styles.tierName}>{tier.name}</Text>
            <Text style={styles.tierPrice}>{tier.price}</Text>
          </View>
          <Text style={styles.muted}>{tier.desc}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.section}>Pay using</Text>
      {METHODS.map((m) => (
        <View key={m} style={styles.method}>
          <Text style={styles.methodText}>{m}</Text>
          <Text style={styles.muted}>›</Text>
        </View>
      ))}

      <Button label="Subscribe — ₹1,699 / year" variant="green" />
      <Text style={styles.secure}>Auto-renews yearly · cancel anytime · Razorpay secure</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  h1: { fontSize: 18, fontWeight: '700', color: colors.maroon },
  muted: { fontSize: 12, color: colors.muted, marginTop: 4 },
  tier: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 12,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
  tierSel: { borderColor: colors.saffron, backgroundColor: '#FFF7EF' },
  tierRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tierName: { fontSize: 13, fontWeight: '700', color: colors.ink },
  tierPrice: { fontSize: 15, fontWeight: '700', color: colors.maroon },
  section: { fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 16 },
  method: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  methodText: { fontSize: 13, color: colors.ink },
  secure: { fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6 },
});
