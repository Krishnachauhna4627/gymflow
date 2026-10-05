import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const LOGO_DIR = resolve(process.env.UPLOAD_DIR || 'data/uploads', 'logos');

mkdirSync(LOGO_DIR, { recursive: true });

/**
 * Detects the image type from the file's magic bytes. The client-sent MIME type and
 * file name are never trusted. SVG is deliberately not accepted (it can carry scripts).
 */
export function detectImageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'png';
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg';
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return 'webp';
  }
  return null;
}

/** Writes the logo under a random name and returns that file name. */
export async function saveLogo(buffer, ext) {
  const fileName = `${randomBytes(12).toString('hex')}.${ext}`;
  await writeFile(join(LOGO_DIR, fileName), buffer, { flag: 'wx' });
  return fileName;
}

export async function deleteLogo(fileName) {
  await unlink(join(LOGO_DIR, fileName)).catch(() => {});
}

export const logoPath = (fileName) => join(LOGO_DIR, fileName);
