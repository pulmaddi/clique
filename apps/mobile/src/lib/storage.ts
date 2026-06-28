import * as DocumentPicker from 'expo-document-picker';
import { supabase } from './supabase';

/** Open the file picker for an image or audio file. Returns the asset or null. */
export async function pickFile(kind: 'image' | 'audio') {
  const res = await DocumentPicker.getDocumentAsync({
    type: kind === 'image' ? ['image/*'] : ['audio/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (res.canceled || !res.assets?.[0]) return null;
  return res.assets[0];
}

async function assetToBytes(asset: any): Promise<ArrayBuffer> {
  if (asset.file) return await asset.file.arrayBuffer(); // web
  const res = await fetch(asset.uri);
  return await res.arrayBuffer(); // native
}

/** Upload an asset to the public 'deities' bucket at `path` (upsert). */
export async function uploadToDeities(path: string, asset: any): Promise<string> {
  const { error } = await supabase.storage
    .from('deities')
    .upload(path, await assetToBytes(asset), {
      contentType: asset.mimeType || (path.endsWith('.mp3') ? 'audio/mpeg' : 'image/png'),
      upsert: true,
    });
  if (error) throw error;
  return path;
}
