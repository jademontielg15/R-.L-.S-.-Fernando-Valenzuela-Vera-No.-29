import 'server-only';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function createAdminRegistrationCode() {
  const code = randomBytes(32).toString('base64url');
  return { code, tokenHash: hashAdminRegistrationCode(code) };
}

export function hashAdminRegistrationCode(code: string) {
  return createHash('sha256').update(code).digest('hex');
}

export function isValidRegistrationSetupSecret(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}
