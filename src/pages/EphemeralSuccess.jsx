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
    <div className="max-w-xl mx-auto pt-28 px-6" data-testid="ephemeral-success">
      <div className="label-mono mb-3">FIG · your link</div>
      <h1 className="display text-3xl mb-3">Your link is ready</h1>
      <p
        role="alert"
        className="text-sm text-[#15161a] border-l-2 border-[#2d4bff] pl-3 mb-6"
      >
        Save this link now — it can’t be recovered, and the page expires in 3 days.
        Anyone with the link can view it.
      </p>

      <div className="flex gap-2 items-stretch mb-5">
        <input
          readOnly
          value={link}
          data-testid="share-link"
          aria-label="Your share link"
          className="field flex-1 px-3 py-2.5 rounded-lg text-sm mono"
        />
        <button onClick={copy} className="btn-primary px-5 py-2.5 rounded-lg text-sm whitespace-nowrap">
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm mb-5 font-[var(--font-sans)]">
        <input
          type="checkbox"
          checked={saved}
          onChange={(e) => setSaved(e.target.checked)}
          className="accent-[#2d4bff] w-4 h-4"
        />
        I’ve saved my link
      </label>

      <button
        disabled={!saved}
        onClick={onDone}
        className="btn-ghost px-6 py-2.5 rounded-lg text-sm disabled:opacity-40"
      >
        Done
      </button>
    </div>
  );
}
