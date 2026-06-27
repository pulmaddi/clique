import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { useAuth } from '../lib/auth';
import { useDeities } from '../lib/deities';

type Props = NativeStackScreenProps<RootStackParamList, 'Pooja'>;

export default function PoojaScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { imageUrlForName, audioUrlForName } = useDeities();

  const deityName = profile?.ishta_daiva || '';
  const imageUrl = imageUrlForName(deityName);
  const audioUrl = audioUrlForName(deityName);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Loop the mantra while the pooja is open.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!audioUrl) return;
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
      } catch {
        // ignore (e.g. autoplay blocked / unsupported) — image-only pooja
      }
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

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      ) : (
        <Text style={styles.om}>🕉️</Text>
      )}

      <TouchableOpacity style={styles.close} onPress={close} accessibilityLabel="Close">
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  om: { fontSize: 120, color: colors.cream },
  close: {
    position: 'absolute',
    top: 44,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  closeIcon: { color: '#fff', fontSize: 22, fontWeight: '700' },
});
