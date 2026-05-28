const API_BASE = '/api';

async function api(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('tfke_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...opts.headers,
  };

  const res = await fetch(url, { ...opts, headers });

  if (res.status === 401) {
    localStorage.removeItem('tfke_token');
    localStorage.removeItem('tfke_user');
    window.location.href = '/login';
    return null;
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || `HTTP ${res.status}`);
  }
  return data;
}

export const auth = {
  register: (user) => api('/auth/register', { method: 'POST', body: JSON.stringify(user) }),
  login: (creds) => api('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
};

export const users = {
  me: (username) => api(`/users/me?username=${encodeURIComponent(username)}`),
  get: (username) => api(`/users/${encodeURIComponent(username)}`),
  update: (username, data) => api(`/users/me?username=${encodeURIComponent(username)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  addInfo: (username, info) => api(`/users/me/infos?username=${encodeURIComponent(username)}`, {
    method: 'POST',
    body: JSON.stringify(info),
  }),
  removeInfo: (username, infoId) => api(`/users/me/infos/${infoId}?username=${encodeURIComponent(username)}`, {
    method: 'DELETE',
  }),
};
