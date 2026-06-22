import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card, Title, Muted, Button } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'HostProfile'>;

export default function HostProfileScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cover} />
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 24 }}>🛕</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Title style={{ fontSize: 15 }}>Sri Venkateswara Temple</Title>
            <Muted>12,480 followers · Telugu · Hyderabad ✔︎ Verified</Muted>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label="Follow" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Subscribe"
              variant="outline"
              onPress={() =>
                navigation.navigate('Subscribe', {
                  hostId: 'demo',
                  hostName: 'Sri Venkateswara Temple',
                })
              }
            />
          </View>
        </View>

        <Text style={styles.section}>Upcoming</Text>
        <Card>
          <Title>Daily Suprabhatam</Title>
          <Muted>Tomorrow 5:30 AM · Free</Muted>
        </Card>
        <Card>
          <Title>Satyanarayan Puja</Title>
          <Muted>Fri 6:30 PM · ₹252</Muted>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  cover: { height: 90, backgroundColor: colors.maroon },
  body: { padding: spacing.lg, marginTop: -30 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  section: { fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 16 },
});
