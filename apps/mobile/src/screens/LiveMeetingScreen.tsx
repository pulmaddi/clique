import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveMeeting'>;

// NOTE: This is the UI shell. Wire @livekit/react-native here:
//   1. call api.joinRoom(occasionInstanceId) -> { token, livekitUrl }
//   2. connect a Room and render RemoteParticipant video tracks.
// Kept presentational in the scaffold so it renders without native LiveKit deps.
export default function LiveMeetingScreen({ navigation }: Props) {
  const controls = ['🎤', '✋', '💬', '🪔'];
  return (
    <View style={styles.stage}>
      <View style={styles.speaker}>
        <Text style={styles.count}>👁 2,140</Text>
        <View style={styles.face}>
          <Text style={{ fontSize: 34 }}>🧘</Text>
        </View>
        <View style={styles.reactions}>
          <Text style={styles.reaction}>🪔</Text>
          <Text style={styles.reaction}>🌸</Text>
          <Text style={styles.reaction}>🙏</Text>
        </View>
        <Text style={styles.name}>Swami Anand · Host 🎙️</Text>
      </View>

      <View style={styles.filmstrip}>
        {['👤', '👤', '🙋', '👤'].map((p, i) => (
          <View key={i} style={styles.pip}>
            <Text style={{ fontSize: 18 }}>{p}</Text>
          </View>
        ))}
        <View style={styles.pip}>
          <Text style={{ color: colors.white, fontSize: 11 }}>+2.1k</Text>
        </View>
      </View>

      <View style={styles.controls}>
        {controls.map((c) => (
          <TouchableOpacity key={c} style={styles.cbtn}>
            <Text style={{ fontSize: 16 }}>{c}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.cbtn, styles.end]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 16 }}>📞</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: '#13100C' },
  speaker: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  count: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: colors.white,
    fontSize: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  face: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactions: { position: 'absolute', right: 18, bottom: 80 },
  reaction: { fontSize: 22, marginVertical: 2 },
  name: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: colors.white,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  filmstrip: { flexDirection: 'row', padding: 8, gap: 6 },
  pip: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#2A2018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#0C0A07',
  },
  cbtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: { backgroundColor: colors.live },
});
