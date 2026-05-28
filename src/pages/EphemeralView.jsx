import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { decryptPayload } from '../lib/webcrypto';
import { getPlatform } from '../data/platforms';
import PlatformIcon from '../components/PlatformIcon';

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
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        if (active) setState('decryptfail');
      }
    })();
    return () => { active = false; };
  }, [token]);

  if (state === 'loading') return <Centered tag="decrypting">Decrypting in your browser…</Centered>;
  if (state === 'broken') return <Centered tag="error">This link is incomplete or broken. Ask the sender for the full link.</Centered>;
  if (state === 'notfound') return <Centered tag="404">This page doesn’t exist.</Centered>;
  if (state === 'expired')
    return (
      <Centered tag="410 · expired">
        This page has expired — ephemeral links last 3 days.
        <div className="mt-4"><a href="/create" className="text-blue underline underline-offset-4">Create your own</a></div>
      </Centered>
    );
  if (state === 'decryptfail') return <Centered tag="key error">This link can’t be opened (wrong or corrupted key).</Centered>;

  const infos = Array.isArray(payload?.infos) ? payload.infos : [];
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-24 pb-16" data-testid="ephemeral-view">
      <div className="tag">Fig. — shared payment info</div>
      <h1 className="head text-4xl mt-1">{String(payload?.displayName || 'Payment info')}</h1>
      <p className="tag mt-1 mb-6">Expires in 3 days · decrypted in your browser</p>

      <div className="figure">
        <span className="fig-tag">Fig. 001</span>
        {infos.map((info, i) => {
          const p = getPlatform(info?.platformId);
          return (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-line-soft last:border-b-0">
              <PlatformIcon platformId={info?.platformId} size={40} />
              <div className="min-w-0">
                <div className="tag">{p.name}</div>
                <div className="mono text-[15px] text-ink break-all">{String(info?.value ?? '')}</div>
                {info?.accountName ? <div className="tag normal-case lowercase text-[#8a8a82]">a/n {String(info.accountName)}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Centered({ children, tag }) {
  return (
    <div className="max-w-md mx-auto px-5 pt-36 text-center" data-testid="view-state">
      {tag && <div className="tag mb-3">Fig. — {tag}</div>}
      <p className="serif text-lg text-ink leading-snug">{children}</p>
    </div>
  );
}
