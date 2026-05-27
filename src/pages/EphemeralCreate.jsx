import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { platforms, categoryLabels } from '../data/platforms';
import { api } from '../lib/api';
import { encryptPayload } from '../lib/webcrypto';
import EphemeralSuccess from './EphemeralSuccess';

const emptyInfo = () => ({ platformId: platforms[0].id, value: '', label: '', accountName: '' });

export default function EphemeralCreate() {
  const [displayName, setDisplayName] = useState('');
  const [infos, setInfos] = useState([emptyInfo()]);
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [error, setError] = useState('');
  const [link, setLink] = useState(null);
  const navigate = useNavigate();

  const updateInfo = (i, patch) =>
    setInfos((prev) => prev.map((info, idx) => (idx === i ? { ...info, ...patch } : info)));
  const addInfo = () => setInfos((prev) => [...prev, emptyInfo()]);
  const removeInfo = (i) => setInfos((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    const cleaned = infos
      .filter((x) => x.value.trim())
      .map((x) => ({ platformId: x.platformId, value: x.value.trim(), label: x.label.trim(), accountName: x.accountName.trim() }));
    if (!cleaned.length) {
      setError('Add at least one payment info.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError('');
    try {
      const { blobBase64, keyB64url } = await encryptPayload({ displayName: displayName.trim(), infos: cleaned });
      const { token } = await api.post('/p', { blob: blobBase64 });
      setLink(`${window.location.origin}/p/${token}#${keyB64url}`);
    } catch (err) {
      setStatus('error');
      setError(
        err?.kind === 'rateLimited'
          ? `Too many attempts. Try again${err.retryAfter ? ` in ${err.retryAfter}s` : ' later'}.`
          : 'Could not create your page. Please try again.',
      );
    }
  };

  if (link) return <EphemeralSuccess link={link} onDone={() => navigate('/')} />;

  const submitting = status === 'submitting';
  const sans = { fontFamily: 'var(--font-sans)' };

  return (
    <div className="max-w-xl mx-auto pt-28 px-6" data-testid="ephemeral-create">
      <div className="label-mono mb-3">FIG · create</div>
      <h1 className="display text-3xl mb-2">Create a shareable page</h1>
      <p className="text-[#5f6066] text-sm mb-7" style={sans}>
        Encrypted in your browser. No account, no email — the page disappears after 3 days.
      </p>

      <form onSubmit={submit} className="space-y-5" style={sans}>
        <div>
          <label className="label-mono block mb-1.5">Display name (optional)</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Askar"
            className="field w-full px-3 py-2.5 rounded-lg text-sm"
          />
        </div>

        {infos.map((info, i) => (
          <div key={i} className="p-3.5 rounded-xl card space-y-2">
            <div className="flex gap-2">
              <select
                value={info.platformId}
                onChange={(e) => updateInfo(i, { platformId: e.target.value })}
                aria-label="Platform"
                className="field px-2 py-2.5 rounded-lg text-sm"
              >
                {Object.keys(categoryLabels).map((cat) => (
                  <optgroup key={cat} label={categoryLabels[cat]}>
                    {platforms.filter((p) => p.category === cat).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <input
                value={info.value}
                onChange={(e) => updateInfo(i, { value: e.target.value })}
                placeholder="Account number / handle"
                aria-label="Value"
                className="field flex-1 px-3 py-2.5 rounded-lg text-sm mono"
              />
              {infos.length > 1 && (
                <button type="button" onClick={() => removeInfo(i)} aria-label="Remove" className="px-2 text-[#d23b3b]">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <input
              value={info.accountName}
              onChange={(e) => updateInfo(i, { accountName: e.target.value })}
              placeholder="Account holder name (optional)"
              aria-label="Account name"
              className="field w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
        ))}

        <button type="button" onClick={addInfo} className="flex items-center gap-1 text-sm text-[#2d4bff]">
          <Plus size={14} /> Add another
        </button>

        {error && <p role="alert" className="text-[#d23b3b] text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 rounded-lg text-sm">
          {submitting ? 'Encrypting…' : 'Create link'}
        </button>
      </form>
    </div>
  );
}
