// Central API access seam for tfke-web.
//
// Every call to tfke-be goes through here so that:
//  - the base URL comes from one place (VITE_API_URL),
//  - credentials (the SameSite=Lax session cookie) are always sent,
//  - HTTP status is mapped to a typed ApiError the UI can branch on,
//  - response payloads are normalized into the canonical camelCase shape in ONE
//    place, so a backend field rename is caught/adapted here rather than deep in
//    components (the runtime guard for the no-shared-types decision).

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Typed error for non-2xx responses and network failures. */
export class ApiError extends Error {
  constructor(kind, status, body) {
    super(body?.message || kind);
    this.name = 'ApiError';
    this.kind = kind; // 'badRequest' | 'unauthorized' | 'forbidden' | 'notFound' | 'gone' | 'rateLimited' | 'server' | 'network'
    this.status = status; // HTTP status, or 0 for network errors
    this.body = body ?? null;
    // Surfaced from a 429 Retry-After header when present (seconds).
    this.retryAfter = body?.retryAfter ?? null;
  }
}

function kindForStatus(status) {
  switch (status) {
    case 400: return 'badRequest';
    case 401: return 'unauthorized';
    case 403: return 'forbidden';
    case 404: return 'notFound';
    case 410: return 'gone';
    case 429: return 'rateLimited';
    default: return status >= 500 ? 'server' : 'badRequest';
  }
}

async function request(method, path, body) {
  const url = `${BASE_URL}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('network', 0, null);
  }

  if (res.status === 204) return null;

  let payload = null;
  const text = await res.text();
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = { message: text }; }
  }

  if (!res.ok) {
    if (res.status === 429) {
      const ra = res.headers.get('Retry-After');
      payload = { ...(payload || {}), retryAfter: ra ? Number(ra) : null };
    }
    throw new ApiError(kindForStatus(res.status), res.status, payload);
  }
  return payload;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
  patch: (path, body) => request('PATCH', path, body ?? {}),
  del: (path) => request('DELETE', path),
};

// --- Response normalization -------------------------------------------------
// The backend serves camelCase, but normalizing here means any drift is adapted
// in one file. Unknown fields are tolerated; missing ones get safe defaults.

/** Normalize a payment-info object into the canonical shape. */
export function normalizeInfo(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    id: String(raw.id), // UUIDv7 string — never assume numeric/ascending; order by `position`
    platformId: raw.platformId ?? raw.platform_id ?? '',
    value: raw.value ?? '',
    label: raw.label ?? '',
    accountName: raw.accountName ?? raw.account_name ?? '',
    position: typeof raw.position === 'number' ? raw.position : 0,
  };
}

/** Normalize a public/owner profile payload into the canonical shape. */
export function normalizeProfile(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const displayName = raw.displayName ?? raw.display_name ?? '';
  return {
    username: raw.username ?? '',
    displayName,
    bio: raw.bio ?? '',
    avatar: raw.avatar ?? (displayName ? displayName.charAt(0).toUpperCase() : '?'),
    infos: Array.isArray(raw.infos)
      ? raw.infos.map(normalizeInfo).filter(Boolean).sort((a, b) => a.position - b.position)
      : [],
  };
}
