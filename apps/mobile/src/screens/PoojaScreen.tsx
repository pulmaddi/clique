import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';
import { useDeities } from '../lib/deities';

type Props = NativeStackScreenProps<RootStackParamList, 'Pooja'>;

export default function PoojaScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { findByName, imageUrlForName, audioUrlForName } = useDeities();

  const deityName = profile?.ishta_daiva || '';
  const deity = findByName(deityName);
  const imageUrl = imageUrlForName(deityName);
  const audioUrl = audioUrlForName(deityName);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(!!audioUrl);

  // Load + loop the mantra on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!audioUrl) {
        setLoading(false);
        return;
      }
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true, isLooping: true },
        );
        if (!active) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        setPlaying(true);
      } catch {
        // ignore load errors (e.g. unsupported format) — image-only pooja
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      const s = soundRef.current;
      soundRef.current = null;
      if (s) void s.unloadAsync();
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    const s = soundRef.current;
    if (!s) return;
    if (playing) {
      await s.pauseAsync();
      setPlaying(false);
    } else {
      await s.playAsync();
      setPlaying(true);
    }
  };

  const endPooja = async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) await s.unloadAsync();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Close */}
      <TouchableOpacity style={styles.close} onPress={endPooja} accessibilityLabel="Close">
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        <View style={styles.halo}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.om}>🕉️</Text>
          )}
        </View>

        <Text style={styles.name}>
          {deity?.display_name || deityName || t('pooja.title')}
        </Text>
        <Text style={styles.sub}>🙏 {t('pooja.subtitle')}</Text>

        {loading ? (
          <ActivityIndicator color={colors.cream} style={{ marginTop: 24 }} />
        ) : audioUrl ? (
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
            <Text style={styles.playLabel}>
              {playing ? t('pooja.playing') : t('pooja.paused')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noAudio}>{t('pooja.noAudio')}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.endBtn} onPress={endPooja}>
        <Text style={styles.endLabel}>✕ {t('pooja.end')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  close: {
    position: 'absolute',
    top: 44,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  closeIcon: { color: colors.white, fontSize: 20, fontWeight: '700' },
  center: { alignItems: 'center' },
  halo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 3,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: 214, height: 214, borderRadius: 107 },
  om: { fontSize: 90 },
  name: { color: colors.white, fontSize: 26, fontWeight: '800', marginTop: 26 },
  sub: { color: colors.cream, fontSize: 14, opacity: 0.9, marginTop: 6 },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 26,
    marginTop: 28,
  },
  playIcon: { color: colors.white, fontSize: 20 },
  playLabel: { color: colors.white, fontSize: 14, fontWeight: '600' },
  noAudio: { color: colors.cream, opacity: 0.8, fontSize: 13, marginTop: 28 },
  endBtn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: colors.saffron,
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 30,
  },
  endLabel: { color: colors.white, fontSize: 15, fontWeight: '800' },
});
