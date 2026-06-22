import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

/** Stand-in for tabs not yet built (Events calendar, Profile). */
export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🪷</Text>
      <Text style={styles.text}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  icon: { fontSize: 40 },
  text: { color: colors.muted, marginTop: 8 },
});
