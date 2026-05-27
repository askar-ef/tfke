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

  return (
    <div className="max-w-xl mx-auto pt-24 px-4" data-testid="ephemeral-create">
      <h1 className="text-2xl font-bold mb-1">Create a shareable page</h1>
      <p className="text-gray-500 text-sm mb-6">
        Encrypted in your browser. No account, no email — the page disappears after 3 days.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Display name (optional)</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Askar"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          />
        </div>

        {infos.map((info, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex gap-2">
              <select
                value={info.platformId}
                onChange={(e) => updateInfo(i, { platformId: e.target.value })}
                aria-label="Platform"
                className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
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
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
              />
              {infos.length > 1 && (
                <button type="button" onClick={() => removeInfo(i)} aria-label="Remove" className="px-2 text-red-400">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <input
              value={info.accountName}
              onChange={(e) => updateInfo(i, { accountName: e.target.value })}
              placeholder="Account holder name (optional)"
              aria-label="Account name"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
          </div>
        ))}

        <button type="button" onClick={addInfo} className="flex items-center gap-1 text-sm text-indigo-400">
          <Plus size={14} /> Add another
        </button>

        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm disabled:opacity-50"
        >
          {submitting ? 'Encrypting…' : 'Create link'}
        </button>
      </form>
    </div>
  );
}
