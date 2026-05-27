// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { encryptPayload, decryptPayload } from './webcrypto.js';

describe('webcrypto', () => {
  const payload = { displayName: 'Askar', infos: [{ platformId: 'bca', value: '1234567890' }] };

  it('round-trips a payload (encrypt -> decrypt)', async () => {
    const { blobBase64, keyB64url } = await encryptPayload(payload);
    const out = await decryptPayload(blobBase64, keyB64url);
    expect(out).toEqual(payload);
  });

  it('exports a URL-safe base64url key', async () => {
    const { keyB64url } = await encryptPayload(payload);
    expect(keyB64url).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('fails to decrypt with the wrong key', async () => {
    const { blobBase64 } = await encryptPayload(payload);
    const { keyB64url: otherKey } = await encryptPayload(payload);
    await expect(decryptPayload(blobBase64, otherKey)).rejects.toBeTruthy();
  });

  it('fails to decrypt a tampered blob', async () => {
    const { blobBase64, keyB64url } = await encryptPayload(payload);
    // Flip the last base64 char to corrupt the ciphertext/tag.
    const tampered = blobBase64.slice(0, -2) + (blobBase64.slice(-2, -1) === 'A' ? 'B' : 'A') + blobBase64.slice(-1);
    await expect(decryptPayload(tampered, keyB64url)).rejects.toBeTruthy();
  });
});
