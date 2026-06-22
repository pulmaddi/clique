import React from 'react';
import {
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewProps,
  StyleSheet,
} from 'react-native';
import { colors, radius, spacing } from '../theme';

export const Card = ({ style, ...props }: ViewProps) => (
  <View style={[styles.card, style]} {...props} />
);

export const Title = ({ style, ...props }: TextProps) => (
  <Text style={[styles.title, style]} {...props} />
);

export const Muted = ({ style, ...props }: TextProps) => (
  <Text style={[styles.muted, style]} {...props} />
);

export const Button = ({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'green';
}) => (
  <TouchableOpacity
    style={[
      styles.btn,
      variant === 'outline' && styles.btnOutline,
      variant === 'green' && styles.btnGreen,
    ]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Text
      style={[styles.btnText, variant === 'outline' && styles.btnTextOutline]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const LiveBadge = () => (
  <View style={styles.liveBadge}>
    <Text style={styles.liveText}>● LIVE</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  title: { fontSize: 14, fontWeight: '600', color: colors.ink },
  muted: { fontSize: 12, color: colors.muted },
  btn: {
    backgroundColor: colors.saffron,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnOutline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.maroon,
  },
  btnGreen: { backgroundColor: colors.green },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  btnTextOutline: { color: colors.maroon },
  liveBadge: {
    backgroundColor: colors.live,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  liveText: { color: colors.white, fontSize: 9, fontWeight: '700' },
});
