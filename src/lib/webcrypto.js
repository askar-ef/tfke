// Client-side zero-knowledge encryption for ephemeral pages.
//
// The browser generates a random AES-256-GCM key, encrypts the payload, and
// uploads ONLY the ciphertext blob to tfke-be. The key is exported as base64url
// and placed in the share link's URL fragment (#...) — it never reaches the
// server. The blob is sent/stored as standard base64; only the key is secret.

const IV_LEN = 12;

function toB64(bytes) {
  let bin = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}

function fromB64(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function toB64url(bytes) {
  return toB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s) {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return fromB64(padded);
}

/**
 * Encrypt a JSON-serializable payload. Returns the standard-base64 blob to POST
 * and the base64url key for the URL fragment.
 */
export async function encryptPayload(payload) {
  const subtle = globalThis.crypto.subtle;
  const key = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  const blob = new Uint8Array(IV_LEN + ct.length);
  blob.set(iv, 0);
  blob.set(ct, IV_LEN);
  const rawKey = await subtle.exportKey('raw', key);
  return { blobBase64: toB64(blob), keyB64url: toB64url(rawKey) };
}

/**
 * Decrypt a base64 blob with a base64url key. Throws on any failure (wrong key,
 * tampered ciphertext) — callers map that to a single "can't open" state.
 */
export async function decryptPayload(blobBase64, keyB64url) {
  const subtle = globalThis.crypto.subtle;
  const blob = fromB64(blobBase64);
  const iv = blob.slice(0, IV_LEN);
  const ct = blob.slice(IV_LEN);
  const rawKey = fromB64url(keyB64url);
  const key = await subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}
