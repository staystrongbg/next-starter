/**
 * Image upload abstraction.
 *
 * NOTE: `User.image` in the database should store a **URL** (Vercel Blob / S3 / CDN),
 * not a base64 data-URL. Base64 bloats the DB (33% overhead) and breaks caching.
 * This stub currently falls back to base64 for local dev; swap the implementation
 * for ` @vercel/blob` or AWS S3 when deploying.
 *
 * Example Vercel Blob:
 * ```ts
 * import { put } from '@vercel/blob';
 * export async function uploadImage(file: File): Promise<string> {
 *   const blob = await put(`avatars/${crypto.randomUUID()}-${file.name}`, file, {
 *     access: 'public',
 *   });
 *   return blob.url;
 * }
 * ```
 */

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed (image/*).';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File too large. Max size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`;
  }
  return null;
}

/**
 * Upload image and return public URL.
 * TODO: Replace base64 fallback with Vercel Blob / S3 in production.
 */
export async function uploadImage(file: File): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  // ---- DEV FALLBACK: base64 data URL ----
  // In production this should upload to blob storage and return the URL.
  // Keeping base64 here avoids adding @vercel/blob dependency before infra is ready,
  // but be aware it bloats `User.image` column.
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  // Example prod return: return blobUrl
  return base64;
}
