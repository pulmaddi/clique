import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Button } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'RitualBooking'>;

const OFFERINGS = [
  { label: '🌸 Flower garland', price: 'Free' },
  { label: '🪔 Diya offering', price: '+ ₹51' },
  { label: '🥥 Coconut & prasad kit', price: '+ ₹101' },
];

export default function RitualBookingScreen({ route }: Props) {
  const { title } = route.params;
  const [sankalpa, setSankalpa] = useState({ name: '', gotra: '', place: '', intention: '' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>{title} Puja</Text>
      <Card style={styles.hostCard}>
        <Text style={styles.hostTitle}>Hosted by Sri Venkateswara Temple</Text>
        <Text style={styles.muted}>Fri, 27 Jun · 6:30 PM IST · Telugu/Hindi</Text>
      </Card>
      <Text style={styles.muted}>
        A pandit performs the puja live; you join with your family name & sankalpa.
        Digital prasad is sent afterwards.
      </Text>

      <Text style={styles.section}>Your Sankalpa</Text>
      {([
        ['name', 'Name (for sankalpa)'],
        ['gotra', 'Gotra (optional)'],
        ['place', 'Place / city'],
        ['intention', 'Your intention / prayer'],
      ] as const).map(([key, ph]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={ph}
          value={sankalpa[key]}
          onChangeText={(v) => setSankalpa((s) => ({ ...s, [key]: v }))}
        />
      ))}

      <Text style={styles.section}>Add offerings</Text>
      {OFFERINGS.map((o) => (
        <View key={o.label} style={styles.row}>
          <Text style={styles.rowLabel}>{o.label}</Text>
          <Text style={styles.rowPrice}>{o.price}</Text>
        </View>
      ))}

      <Card style={{ marginTop: 14 }}>
        <View style={styles.totalRow}>
          <Text style={styles.muted}>Total</Text>
          <Text style={styles.total}>₹252</Text>
        </View>
        <Button label="Pay with UPI / Card →" variant="green" />
        <Text style={styles.secure}>Secured by Razorpay · GST invoice provided</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  h1: { fontSize: 18, fontWeight: '700', color: colors.maroon },
  hostCard: { backgroundColor: '#FFF7EF', borderColor: '#F0D3AD' },
  hostTitle: { fontSize: 13, fontWeight: '600', color: colors.ink },
  muted: { fontSize: 12, color: colors.muted, marginTop: 4 },
  section: { fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 16, marginBottom: 4 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginVertical: 5,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLabel: { fontSize: 13, color: colors.ink },
  rowPrice: { fontSize: 13, color: colors.muted },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontSize: 16, fontWeight: '700', color: colors.maroon },
  secure: { fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6 },
});
