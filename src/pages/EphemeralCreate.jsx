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
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [link, setLink] = useState(null);
  const navigate = useNavigate();

  const updateInfo = (i, patch) => setInfos((p) => p.map((info, idx) => (idx === i ? { ...info, ...patch } : info)));
  const addInfo = () => setInfos((p) => [...p, emptyInfo()]);
  const removeInfo = (i) => setInfos((p) => p.filter((_, idx) => idx !== i));

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
    <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-24 pb-16" data-testid="ephemeral-create">
      <div className="tag">Fig. — create a page</div>
      <h1 className="head text-4xl mt-1 mb-2">Create a shareable page</h1>
      <p className="serif text-[#44443f] mb-7 leading-snug">
        Encrypted in your browser. No account, no email — the page disappears after 3 days.
      </p>

      <form onSubmit={submit} className="figure p-6 sm:p-8 space-y-6">
        <span className="fig-tag">Fig. 001</span>
        <div className="pl-2">
          <label className="tag block mb-2">Display name (optional)</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Askar"
            className="field w-full px-3 py-2.5"
          />
        </div>

        <div className="pl-2 space-y-3">
          <label className="tag block">Payment details</label>
          {infos.map((info, i) => (
            <div key={i} className="border border-line-soft p-3 space-y-2 bg-white">
              <div className="flex gap-2">
                <select
                  value={info.platformId}
                  onChange={(e) => updateInfo(i, { platformId: e.target.value })}
                  aria-label="Platform"
                  className="field px-2 py-2.5"
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
                  className="field flex-1 px-3 py-2.5"
                />
                {infos.length > 1 && (
                  <button type="button" onClick={() => removeInfo(i)} aria-label="Remove" className="px-2 text-[#cc2b2b] border border-ink bg-white">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input
                value={info.accountName}
                onChange={(e) => updateInfo(i, { accountName: e.target.value })}
                placeholder="Account holder name (optional)"
                aria-label="Account name"
                className="field w-full px-3 py-2.5"
              />
            </div>
          ))}
          <button type="button" onClick={addInfo} className="tag flex items-center gap-1 hover:text-blue">
            <Plus size={13} /> Add another
          </button>
        </div>

        {error && <p role="alert" className="tag text-[#cc2b2b] pl-2">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
          {submitting ? 'Encrypting…' : 'Create link →'}
        </button>
      </form>
    </div>
  );
}
