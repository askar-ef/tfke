import { useState } from 'react';

// One-shot success screen. The decryption key lives only in `link` (its #fragment)
// and is unrecoverable, so: copy the FULL link (incl. fragment), and gate any
// navigation behind an explicit "I've saved my link" confirmation. Never strip
// the fragment here (that only happens on the viewer after a successful decrypt).
export default function EphemeralSuccess({ link, onDone }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is selectable in the field as a fallback */
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-24 px-4" data-testid="ephemeral-success">
      <h1 className="text-2xl font-bold mb-2">Your link is ready</h1>
      <p role="alert" className="text-amber-400 text-sm mb-4">
        Save this link now — it can’t be recovered, and the page expires in 3 days.
        Anyone with the link can view it.
      </p>

      <div className="flex gap-2 items-stretch mb-4">
        <input
          readOnly
          value={link}
          data-testid="share-link"
          aria-label="Your share link"
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
        />
        <button
          onClick={copy}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm mb-4">
        <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
        I’ve saved my link
      </label>

      <button
        disabled={!saved}
        onClick={onDone}
        className="px-6 py-2 rounded-lg bg-white/10 text-sm font-medium disabled:opacity-40"
      >
        Done
      </button>
    </div>
  );
}
