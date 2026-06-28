import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';
import { useDeities, deityFileUrl } from '../lib/deities';
import { useWeekdayDeities } from '../lib/weekdayDeities';

type Props = NativeStackScreenProps<RootStackParamList, 'Pooja'>;
const useNative = Platform.OS !== 'web';

// ---- Aarti: a lamp plate orbiting the deity ----
function Aarti() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 3800, easing: Easing.linear, useNativeDriver: useNative }),
    );
    a.start();
    return () => a.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const counter = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });
  return (
    <View style={styles.orbitFill} pointerEvents="none">
      <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
        <Animated.View style={[styles.plate, { transform: [{ rotate: counter }] }]}>
          <Text style={styles.plateFlames}>🪔</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ---- Generic particle layer (falling petals/powder, or rising smoke) ----
function Particles({
  rising,
  count,
  render,
}: {
  rising?: boolean;
  count: number;
  render: (i: number) => React.ReactNode;
}) {
  const { width, height } = useWindowDimensions();
  const parts = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random(),
      delay: Math.random() * 2500,
      dur: 2600 + Math.random() * 2600,
      drift: (Math.random() - 0.5) * 70,
      val: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    const anims = parts.map((p) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.val, { toValue: 1, duration: p.dur, easing: Easing.linear, useNativeDriver: useNative }),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [parts]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {parts.map((p) => {
        const translateY = p.val.interpolate({
          inputRange: [0, 1],
          outputRange: rising ? [height + 40, -60] : [-60, height + 60],
        });
        const translateX = p.val.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] });
        const opacity = p.val.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] });
        const rotate = p.val.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rising ? '0deg' : '300deg'] });
        return (
          <Animated.View
            key={p.id}
            style={{ position: 'absolute', left: p.x * width, transform: [{ translateY }, { translateX }, { rotate }], opacity }}
          >
            {render(p.id)}
          </Animated.View>
        );
      })}
    </View>
  );
}

const FLOWERS = ['🌸', '🌺', '🌼', '🪷'];
const Dot = ({ color }: { color: string }) => (
  <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: color }} />
);

export default function PoojaScreen({ navigation, route }: Props) {
  const { profile } = useAuth();
  const { imageUrlForName, audioUrlForName } = useDeities();
  const { rows, today } = useWeekdayDeities();

  // Vaara Pooja resolves a weekday deity (own image/audio): a specific `day`
  // (admin preview) or today (`vaara`); otherwise the chosen Ishta Daiva.
  const weekday =
    route.params?.day != null
      ? rows.find((r) => r.day === route.params!.day) ?? null
      : route.params?.vaara
      ? today()
      : null;
  const deityName = weekday?.deity_name || route.params?.deityName || profile?.ishta_daiva || '';
  const imageUrl = weekday ? deityFileUrl(weekday.image_path) : imageUrlForName(deityName);
  const audioUrl = weekday ? deityFileUrl(weekday.audio_path) : audioUrlForName(deityName);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [fx, setFx] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setFx((s) => ({ ...s, [k]: !s[k] }));

  useEffect(() => {
    let active = true;
    (async () => {
      if (!audioUrl) return;
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true, isLooping: true });
        if (!active) { await sound.unloadAsync(); return; }
        soundRef.current = sound;
      } catch { /* ignore */ }
    })();
    return () => {
      active = false;
      const s = soundRef.current;
      soundRef.current = null;
      if (s) void s.unloadAsync();
    };
  }, [audioUrl]);

  const close = async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) await s.unloadAsync();
    navigation.goBack();
  };

  const RITUALS = [
    { key: 'aarti', icon: '🪔', label: t('pooja.aarti') },
    { key: 'agarbathi', icon: '🌫️', label: t('pooja.agarbathi') },
    { key: 'flowers', icon: '🌸', label: t('pooja.flowers') },
    { key: 'turmeric', icon: '🟡', label: t('pooja.turmeric') },
    { key: 'saffron', icon: '🟠', label: t('pooja.saffron') },
  ];

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      ) : (
        <Text style={styles.om}>🕉️</Text>
      )}

      {/* Ritual effects */}
      {fx.aarti && <Aarti />}
      {fx.agarbathi && <Particles rising count={10} render={() => <Text style={{ fontSize: 26, opacity: 0.7 }}>💨</Text>} />}
      {fx.flowers && <Particles count={18} render={(i) => <Text style={{ fontSize: 26 }}>{FLOWERS[i % FLOWERS.length]}</Text>} />}
      {fx.turmeric && <Particles count={22} render={() => <Dot color="#E1A100" />} />}
      {fx.saffron && <Particles count={22} render={() => <Dot color="#E8741E" />} />}

      {/* Close */}
      <TouchableOpacity style={styles.close} onPress={close} accessibilityLabel="Close">
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      {/* Ritual toolbar (bottom-left) */}
      <View style={styles.toolbar}>
        {RITUALS.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.ritualBtn, fx[r.key] && styles.ritualBtnOn]}
            onPress={() => toggle(r.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.ritualIcon}>{r.icon}</Text>
            <Text style={styles.ritualLabel}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  om: { fontSize: 120, color: colors.cream },
  close: {
    position: 'absolute', top: 44, right: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  closeIcon: { color: '#fff', fontSize: 22, fontWeight: '700' },

  // aarti orbit
  orbitFill: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  orbit: { width: 250, height: 250, alignItems: 'center', justifyContent: 'flex-start' },
  plate: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#B87333',
    borderWidth: 3, borderColor: '#E8B36A', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF9D2E', shadowOpacity: 0.9, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  plateFlames: { fontSize: 30 },

  // toolbar
  toolbar: { position: 'absolute', left: 14, bottom: 30, gap: 10 },
  ritualBtn: {
    width: 64, alignItems: 'center', paddingVertical: 8, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  ritualBtnOn: { backgroundColor: 'rgba(232,116,30,0.85)', borderColor: '#fff' },
  ritualIcon: { fontSize: 22 },
  ritualLabel: { color: '#fff', fontSize: 9, marginTop: 2, fontWeight: '600' },
});
