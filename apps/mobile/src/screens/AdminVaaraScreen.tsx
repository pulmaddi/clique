import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Button } from '../components/ui';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { pickFile, uploadToDeities } from '../lib/storage';
import {
  useWeekdayDeities,
  clearWeekdayCache,
  type WeekdayDeity,
} from '../lib/weekdayDeities';
import { deityFileUrl } from '../lib/deities';

function WeekdayRow({ row }: { row: WeekdayDeity }) {
  const [name, setName] = useState(row.deity_name ?? '');
  const [imagePath, setImagePath] = useState(row.image_path ?? null);
  const [audioPath, setAudioPath] = useState(row.audio_path ?? null);
  const [imageAsset, setImageAsset] = useState<any>(null);
  const [audioAsset, setAudioAsset] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const slug = row.day_name.toLowerCase();

  const save = async () => {
    setErr('');
    setMsg('');
    if (name.trim().length < 2) return setErr('Enter the deity name.');
    try {
      setBusy(true);
      let image_path = imagePath;
      let audio_path = audioPath;
      if (imageAsset) {
        const ext = (imageAsset.name?.split('.').pop() || 'png').toLowerCase();
        image_path = await uploadToDeities(`weekday/${slug}.${ext}`, imageAsset);
      }
      if (audioAsset) {
        const ext = (audioAsset.name?.split('.').pop() || 'mp3').toLowerCase();
        audio_path = await uploadToDeities(`weekday/${slug}-audio.${ext}`, audioAsset);
      }
      const { error } = await supabase.from('weekday_deities').upsert({
        day: row.day,
        day_name: row.day_name,
        deity_name: name.trim(),
        image_path,
        audio_path,
      });
      if (error) throw error;
      setImagePath(image_path);
      setAudioPath(audio_path);
      setImageAsset(null);
      setAudioAsset(null);
      clearWeekdayCache();
      setMsg('Saved ✓');
    } catch (e: any) {
      setErr(e?.message ?? 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  const previewUri = imageAsset?.uri || deityFileUrl(imagePath) || '';

  return (
    <View style={styles.card}>
      <Text style={styles.day}>{row.day_name}</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('admin.name')}
        placeholderTextColor={colors.muted}
        autoCapitalize="words"
      />

      <View style={styles.pickRow}>
        <View style={styles.preview}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.previewImg} />
          ) : (
            <Text style={{ fontSize: 20 }}>🕉️</Text>
          )}
        </View>
        <View style={styles.pickCol}>
          <Button
            label={t('admin.pickImage')}
            variant="outline"
            onPress={async () => setImageAsset((await pickFile('image')) ?? null)}
          />
          <Text style={styles.fileNote} numberOfLines={1}>
            {imageAsset?.name || imagePath || t('admin.none')}
          </Text>
        </View>
      </View>

      <View style={styles.pickRow}>
        <View style={styles.preview}>
          <Text style={{ fontSize: 20 }}>{audioAsset || audioPath ? '🔊' : '🎵'}</Text>
        </View>
        <View style={styles.pickCol}>
          <Button
            label={t('admin.pickAudio')}
            variant="outline"
            onPress={async () => setAudioAsset((await pickFile('audio')) ?? null)}
          />
          <Text style={styles.fileNote} numberOfLines={1}>
            {audioAsset?.name || audioPath || t('admin.none')}
          </Text>
        </View>
      </View>

      {!!err && <Text style={styles.err}>{err}</Text>}
      {!!msg && <Text style={styles.ok}>{msg}</Text>}
      <Button label={busy ? '…' : t('admin.save')} onPress={save} />
    </View>
  );
}

export default function AdminVaaraScreen() {
  const { isAdmin } = useAuth();
  const { rows } = useWeekdayDeities();

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.deny}>🔒 {t('admin.notAdmin')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.hint}>{t('admin.vaaraHint')}</Text>
      {rows.map((r) => (
        <WeekdayRow key={r.day} row={r} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  body: { padding: spacing.lg, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  deny: { color: colors.muted, fontSize: 15 },
  hint: { fontSize: 13, color: colors.muted, marginBottom: 12 },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 14,
  },
  day: { fontSize: 15, fontWeight: '700', color: colors.maroon, marginBottom: 8 },
  input: {
    backgroundColor: colors.cream,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 10,
  },
  pickRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  preview: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImg: { width: 52, height: 52 },
  pickCol: { flex: 1 },
  fileNote: { fontSize: 11, color: colors.muted, marginTop: 4 },
  err: { color: colors.live, fontSize: 13, marginTop: 4, marginBottom: 4 },
  ok: { color: colors.green, fontSize: 13, marginTop: 4, marginBottom: 4, fontWeight: '600' },
});
