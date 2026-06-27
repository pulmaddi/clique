import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors, radius, spacing } from '../theme';
import { Button } from '../components/ui';
import { t } from '../i18n';
import { useAuth } from '../lib/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { clearDeitiesCache, deityFileUrl, type Deity } from '../lib/deities';

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function assetToBytes(asset: any): Promise<ArrayBuffer> {
  if (asset.file) return await asset.file.arrayBuffer(); // web
  const res = await fetch(asset.uri);
  return await res.arrayBuffer(); // native
}

export default function AdminScreen() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<Deity[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [keyVal, setKeyVal] = useState('');
  const [sort, setSort] = useState('100');
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [imageAsset, setImageAsset] = useState<any>(null);
  const [audioAsset, setAudioAsset] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const loadRows = async () => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('deities')
      .select('key,display_name,image_path,audio_path,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) setRows(data as Deity[]);
  };
  useEffect(() => {
    loadRows();
  }, []);

  const reset = () => {
    setEditingKey(null);
    setName('');
    setKeyVal('');
    setSort('100');
    setImagePath(null);
    setAudioPath(null);
    setImageAsset(null);
    setAudioAsset(null);
    setErr('');
    setMsg('');
  };

  const startEdit = (d: Deity & { sort_order?: number }) => {
    setEditingKey(d.key);
    setName(d.display_name);
    setKeyVal(d.key);
    setSort(String(d.sort_order ?? 100));
    setImagePath(d.image_path);
    setAudioPath(d.audio_path);
    setImageAsset(null);
    setAudioAsset(null);
    setErr('');
    setMsg('');
  };

  const pick = async (kind: 'image' | 'audio') => {
    const res = await DocumentPicker.getDocumentAsync({
      type: kind === 'image' ? ['image/*'] : ['audio/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled || !res.assets?.[0]) return;
    if (kind === 'image') setImageAsset(res.assets[0]);
    else setAudioAsset(res.assets[0]);
  };

  const onSave = async () => {
    setErr('');
    setMsg('');
    if (!isAdmin) return setErr('You are not an admin.');
    const k = keyVal ? slugify(keyVal) : slugify(name);
    if (name.trim().length < 2 || !k) return setErr('Name (and key) are required.');

    try {
      setBusy(true);
      let image_path = imagePath;
      let audio_path = audioPath;

      if (imageAsset) {
        const ext = (imageAsset.name?.split('.').pop() || 'png').toLowerCase();
        const path = `${k}.${ext}`;
        const up = await supabase.storage
          .from('deities')
          .upload(path, await assetToBytes(imageAsset), {
            contentType: imageAsset.mimeType || 'image/png',
            upsert: true,
          });
        if (up.error) throw up.error;
        image_path = path;
      }
      if (audioAsset) {
        const ext = (audioAsset.name?.split('.').pop() || 'mp3').toLowerCase();
        const path = `audio/${k}.${ext}`;
        const up = await supabase.storage
          .from('deities')
          .upload(path, await assetToBytes(audioAsset), {
            contentType: audioAsset.mimeType || 'audio/mpeg',
            upsert: true,
          });
        if (up.error) throw up.error;
        audio_path = path;
      }

      const { error } = await supabase.from('deities').upsert({
        key: k,
        display_name: name.trim(),
        image_path,
        audio_path,
        sort_order: parseInt(sort, 10) || 100,
      });
      if (error) throw error;

      clearDeitiesCache();
      setMsg('Saved ✓ — it now appears in the Ishta Daiva picker.');
      reset();
      loadRows();
    } catch (e: any) {
      setErr(e?.message ?? 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  const del = async (key: string) => {
    setErr('');
    const { error } = await supabase.from('deities').delete().eq('key', key);
    if (error) return setErr(error.message);
    clearDeitiesCache();
    loadRows();
  };

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.deny}>🔒 {t('admin.notAdmin')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.h2}>
        {editingKey ? t('admin.editDeity') : t('admin.addDeity')}
      </Text>

      <Text style={styles.label}>{t('admin.name')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (!editingKey) setKeyVal(slugify(v));
        }}
        placeholder="Venkateswara"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>{t('admin.key')}</Text>
      <TextInput
        style={[styles.input, !!editingKey && styles.readonly]}
        value={keyVal}
        onChangeText={setKeyVal}
        editable={!editingKey}
        placeholder="venkateswara"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
      />

      <Text style={styles.label}>{t('admin.sort')}</Text>
      <TextInput
        style={styles.input}
        value={sort}
        onChangeText={setSort}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>{t('admin.image')}</Text>
      <View style={styles.pickRow}>
        <View style={styles.previewWrap}>
          {imageAsset?.uri ? (
            <Image source={{ uri: imageAsset.uri }} style={styles.preview} />
          ) : imagePath ? (
            <Image source={{ uri: deityFileUrl(imagePath) || '' }} style={styles.preview} />
          ) : (
            <Text style={{ fontSize: 22 }}>🕉️</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Button label={t('admin.pickImage')} variant="outline" onPress={() => pick('image')} />
          <Text style={styles.fileNote} numberOfLines={1}>
            {imageAsset?.name || imagePath || t('admin.none')}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>{t('admin.audio')}</Text>
      <View style={styles.pickRow}>
        <View style={styles.previewWrap}>
          <Text style={{ fontSize: 22 }}>{audioAsset || audioPath ? '🔊' : '🎵'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button label={t('admin.pickAudio')} variant="outline" onPress={() => pick('audio')} />
          <Text style={styles.fileNote} numberOfLines={1}>
            {audioAsset?.name || audioPath || t('admin.none')}
          </Text>
        </View>
      </View>

      {!!err && <Text style={styles.err}>{err}</Text>}
      {!!msg && <Text style={styles.ok}>{msg}</Text>}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <View style={{ flex: 1 }}>
          <Button label={busy ? '…' : t('admin.save')} onPress={onSave} />
        </View>
        {!!editingKey && (
          <View style={{ flex: 1 }}>
            <Button label={t('admin.cancel')} variant="outline" onPress={reset} />
          </View>
        )}
      </View>

      <Text style={[styles.h2, { marginTop: 28 }]}>{t('admin.catalog')}</Text>
      {rows.map((d: any) => (
        <View key={d.key} style={styles.rowCard}>
          <View style={styles.rowThumb}>
            {d.image_path ? (
              <Image source={{ uri: deityFileUrl(d.image_path) || '' }} style={styles.rowImg} />
            ) : (
              <Text style={{ fontSize: 18 }}>🕉️</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowName}>{d.display_name}</Text>
            <Text style={styles.rowMeta}>
              {d.key} {d.audio_path ? '· 🔊 audio' : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => startEdit(d)} style={styles.act}>
            <Text style={styles.actEdit}>{t('admin.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => del(d.key)} style={styles.act}>
            <Text style={styles.actDel}>{t('admin.delete')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  body: { padding: spacing.lg, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  deny: { color: colors.muted, fontSize: 15 },
  h2: { fontSize: 16, fontWeight: '700', color: colors.maroon, marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', color: colors.muted, marginTop: 12, marginBottom: 5 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  readonly: { backgroundColor: '#F4ECDF', color: colors.muted },
  pickRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  previewWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: { width: 60, height: 60 },
  fileNote: { fontSize: 11, color: colors.muted, marginTop: 4 },
  err: { color: colors.live, fontSize: 13, marginTop: 14 },
  ok: { color: colors.green, fontSize: 13, marginTop: 14, fontWeight: '600' },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 10,
    marginTop: 10,
  },
  rowThumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#f0e6d6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rowImg: { width: 42, height: 42 },
  rowName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  rowMeta: { fontSize: 11, color: colors.muted },
  act: { paddingHorizontal: 8, paddingVertical: 6 },
  actEdit: { color: colors.maroon, fontWeight: '700', fontSize: 13 },
  actDel: { color: colors.live, fontWeight: '700', fontSize: 13 },
});
