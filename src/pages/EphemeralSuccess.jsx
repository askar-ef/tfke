import { useState } from 'react';

// One-shot success screen. Key lives only in `link` (its #fragment) and is
// unrecoverable: copy the FULL link, gate navigation behind confirmation, never
// strip the fragment here.
export default function EphemeralSuccess({ link, onDone }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — field is selectable */
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-24 pb-16" data-testid="ephemeral-success">
      <div className="tag">Fig. — your link</div>
      <h1 className="head text-4xl mt-1 mb-3">Your link is ready</h1>

      <p role="alert" className="serif text-ink border-l-2 border-blue pl-3 mb-6 leading-snug">
        Save this link now — it can’t be recovered, and the page expires in 3 days.
        Anyone with the link can view it.
      </p>

      <div className="figure p-5 sm:p-6">
        <span className="fig-tag">Fig. 001</span>
        <label className="tag block mb-2">Share link</label>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            data-testid="share-link"
            aria-label="Your share link"
            className="field flex-1 px-3 py-2.5 text-sm"
          />
          <button onClick={copy} className="btn-primary px-5 py-2.5 whitespace-nowrap">
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        <label className="flex items-center gap-2 tag mt-5 cursor-pointer">
          <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} className="accent-blue w-4 h-4" />
          I’ve saved my link
        </label>
      </div>

      <button disabled={!saved} onClick={onDone} className="btn-ghost px-6 py-2.5 mt-5 disabled:opacity-40">
        Done
      </button>
    </div>
  );
}
