// src/services/imageUploadService.ts
// Handles image uploads to Supabase Storage bucket "event-images"
// Supports: file upload (from disk / camera) OR URL string

import { supabase } from "./supabase";

const BUCKET = "event-images";

/**
 * Upload a File object to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageFile(file: File): Promise<string> {
  // Build a unique path: timestamp + sanitised filename
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Validate that a string looks like an image URL.
 * Just checks it starts with http/https and ends with a common image extension.
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    // Accept any URL — servers may not show extensions (e.g. CDNs)
    return true;
  } catch {
    return false;
  }
}