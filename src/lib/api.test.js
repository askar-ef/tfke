import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, ApiError, normalizeInfo, normalizeProfile } from './api.js';

function fakeResponse({ ok, status, body = '', headers = {} }) {
  return {
    ok,
    status,
    headers: { get: (k) => headers[k] ?? null },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

describe('api request', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves JSON and sends credentials (happy path)', async () => {
    global.fetch.mockResolvedValue(
      fakeResponse({ ok: true, status: 200, body: { hello: 'world' } })
    );
    const out = await api.get('/x');
    expect(out).toEqual({ hello: 'world' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/x'),
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
  });

  it('returns null on 204', async () => {
    global.fetch.mockResolvedValue(fakeResponse({ ok: true, status: 204 }));
    expect(await api.del('/x')).toBeNull();
  });

  it.each([
    [400, 'badRequest'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [410, 'gone'],
    [429, 'rateLimited'],
    [500, 'server'],
  ])('maps HTTP %i to ApiError kind %s', async (status, kind) => {
    global.fetch.mockResolvedValue(fakeResponse({ ok: false, status, body: { message: 'nope' } }));
    await expect(api.get('/x')).rejects.toMatchObject({ name: 'ApiError', kind, status });
  });

  it('surfaces Retry-After on 429', async () => {
    global.fetch.mockResolvedValue(
      fakeResponse({ ok: false, status: 429, body: {}, headers: { 'Retry-After': '12' } })
    );
    await expect(api.post('/x')).rejects.toMatchObject({ kind: 'rateLimited', retryAfter: 12 });
  });

  it('maps a thrown fetch to a network ApiError', async () => {
    global.fetch.mockRejectedValue(new TypeError('failed to fetch'));
    const err = await api.get('/x').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.kind).toBe('network');
    expect(err.status).toBe(0);
  });
});

describe('normalizeInfo', () => {
  it('accepts camelCase and coerces id to a string', () => {
    expect(normalizeInfo({ id: 7, platformId: 'dana', value: '08', label: 'Phone', position: 2 }))
      .toEqual({ id: '7', platformId: 'dana', value: '08', label: 'Phone', accountName: '', position: 2 });
  });

  it('falls back from snake_case (drift tolerance)', () => {
    const out = normalizeInfo({ id: 'a', platform_id: 'bca', account_name: 'Askar', value: '123' });
    expect(out.platformId).toBe('bca');
    expect(out.accountName).toBe('Askar');
  });

  it('returns null for non-objects', () => {
    expect(normalizeInfo(null)).toBeNull();
  });
});

describe('normalizeProfile', () => {
  it('derives avatar from display name and sorts infos by position', () => {
    const p = normalizeProfile({
      username: 'askar',
      displayName: 'Askar',
      infos: [
        { id: '2', platformId: 'bca', value: '1', position: 1 },
        { id: '1', platformId: 'dana', value: '2', position: 0 },
      ],
    });
    expect(p.avatar).toBe('A');
    expect(p.infos.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('handles empty/missing infos', () => {
    expect(normalizeProfile({ username: 'x', displayName: 'Y' }).infos).toEqual([]);
  });
});
