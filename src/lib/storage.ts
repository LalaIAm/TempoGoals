import { supabase } from "./supabase";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
