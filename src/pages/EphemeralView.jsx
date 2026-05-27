import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { decryptPayload } from '../lib/webcrypto';
import { getPlatform } from '../data/platforms';

// Viewer for an ephemeral page. The key comes from the URL fragment (never sent
// to the server). Five outcomes: broken (missing/garbled fragment, no API call),
// notfound (404), expired (410), decryptfail (wrong key/tampered), ok.
export default function EphemeralView() {
  const { token } = useParams();
  const [state, setState] = useState('loading');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let active = true;
    const key = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    if (!key) {
      setState('broken');
      return;
    }
    (async () => {
      let data;
      try {
        data = await api.get(`/p/${encodeURIComponent(token)}`);
      } catch (err) {
        if (!active) return;
        setState(err?.kind === 'gone' ? 'expired' : err?.kind === 'notFound' ? 'notfound' : 'broken');
        return;
      }
      try {
        const obj = await decryptPayload(data.blob, key);
        if (!active) return;
        setPayload(obj);
        setState('ok');
        // Strip the fragment from the address bar only AFTER a successful decrypt.
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        if (active) setState('decryptfail');
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  if (state === 'loading') return <Centered>Decrypting…</Centered>;
  if (state === 'broken')
    return <Centered>This link is incomplete or broken. Ask the sender for the full link.</Centered>;
  if (state === 'notfound') return <Centered>This page doesn’t exist.</Centered>;
  if (state === 'expired')
    return (
      <Centered>
        This page has expired — ephemeral links last 3 days.
        <div className="mt-4">
          <a href="/create" className="text-[#2d4bff] underline underline-offset-2">Create your own</a>
        </div>
      </Centered>
    );
  if (state === 'decryptfail') return <Centered>This link can’t be opened (wrong or corrupted key).</Centered>;

  // state === 'ok' — render decrypted fields as inert text (never as links).
  const infos = Array.isArray(payload?.infos) ? payload.infos : [];
  return (
    <div className="max-w-xl mx-auto pt-28 px-6" data-testid="ephemeral-view">
      <div className="label-mono mb-3">FIG · shared payment info</div>
      <h1 className="display text-3xl">{String(payload?.displayName || 'Payment info')}</h1>
      <p className="text-[#5f6066] text-sm mb-6">Expires in 3 days · decrypted in your browser</p>
      <hr className="rule mb-6" />
      <div className="space-y-2">
        {infos.map((info, i) => {
          const p = getPlatform(info?.platformId);
          return (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl card">
              <span
                className="w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0 mono"
                style={{ backgroundColor: p.color }}
              >
                {String(p.name).slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)' }}>{p.name}</div>
                <div className="text-[15px] mono break-all">{String(info?.value ?? '')}</div>
                {info?.accountName ? (
                  <div className="text-xs text-[#9a9ba1]">a/n {String(info.accountName)}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="max-w-md mx-auto pt-32 px-6 text-center text-[#5f6066]" data-testid="view-state">
      {children}
    </div>
  );
}
