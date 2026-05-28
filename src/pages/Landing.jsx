import { Link } from 'react-router-dom';
import { platforms, getPlatform } from '../data/platforms';
import PlatformIcon from '../components/PlatformIcon';

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-16">
      {/* Masthead */}
      <header className="grid sm:grid-cols-[1fr_auto] gap-6 items-end">
        <h1 className="masthead text-[15vw] sm:text-[7rem] leading-[0.9] cursor-blink animate-fade-in-up">
          Tfke<span className="text-ink">.id</span>
        </h1>
        <p className="serif text-lg text-[#44443f] max-w-xs sm:text-right leading-snug animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          The easiest way to share your payment details. Bank accounts, e-wallets,
          and handles — all in one link. <span className="italic">Encrypted in your browser.</span>
        </p>
      </header>

      <div className="tag mt-5">Edition 01 · 2026 · tfke.id</div>
      <hr className="rule my-7" />

      {/* Intro + primary figure */}
      <section className="grid md:grid-cols-2 gap-10 md:gap-14">
        <div>
          <p className="dropcap serif text-[1.2rem] leading-[1.55] text-justify">
            Ever sent your bank account number three times in one chat because someone
            mistyped it? Tfke puts your payment details — accounts, e-wallets, handles —
            on one page behind a single link. The reader taps once to copy. No more
            reading digits aloud.
          </p>
          <p className="serif text-[1.05rem] leading-[1.55] mt-4 text-[#44443f] text-justify">
            A quick link needs no account and disappears after three days. Sign in to
            keep a permanent, editable page. Either way, the secret stays in the link —
            our servers only ever hold ciphertext.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/create" className="btn-primary px-5 py-3">Create now →</Link>
            <Link to="/register" className="btn-ghost px-5 py-3">Sign in to keep it</Link>
          </div>
          <div className="tag mt-3">No account · no email · expires in 3 days</div>
        </div>

        {/* FIG.001 — a sample page rendered as a technical figure */}
        <figure className="figure p-6 sm:p-8 self-start">
          <span className="fig-tag">Fig. 001</span>
          <span className="fig-tag-v" style={{ left: 10, bottom: 16 }}>[ share link ]</span>
          <div className="pl-3">
            <div className="tag">tfke.id/u/askar</div>
            <div className="head text-2xl mt-1 mb-5">Askar</div>
            <div className="space-y-px border-t border-b border-ink">
              {['bca', 'dana', 'gopay'].map((id) => {
                const p = getPlatform(id);
                const val = id === 'bca' ? '1234567890' : '0812-3456-7890';
                return (
                  <div key={id} className="flex items-center gap-3 py-3 border-t border-line-soft first:border-t-0">
                    <PlatformIcon platformId={id} size={34} />
                    <div className="min-w-0">
                      <div className="tag">{p.name}</div>
                      <div className="mono text-[15px] text-ink">{val}</div>
                    </div>
                    <div className="ml-auto tag">copy ⧉</div>
                  </div>
                );
              })}
            </div>
          </div>
        </figure>
      </section>

      <hr className="rule my-10" />

      {/* FIG.002 — supported platforms, as a specimen plate */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="head text-xl">Platforms</h2>
        </div>
        <div className="figure">
          <div className="grid grid-cols-3 sm:grid-cols-5">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center gap-2 p-4 border-r border-b"
                style={{ borderColor: 'var(--color-line-soft)' }}
              >
                <PlatformIcon platformId={p.id} size={40} />
                <span className="tag text-center leading-tight">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule my-10" />

      {/* How it works — numbered manual steps */}
      <section className="grid sm:grid-cols-3 gap-0 border border-ink">
        {[
          { n: '01', t: 'Write', d: 'Add your accounts and e-wallet handles. No account needed for a quick link.' },
          { n: '02', t: 'Encrypt', d: 'Your details are encrypted in your browser. The key lives only in the link.' },
          { n: '03', t: 'Share', d: 'Send the link. The reader opens it and copies each detail in one tap.' },
        ].map((s, i) => (
          <div key={s.n} className={`p-6 ${i !== 2 ? 'sm:border-r border-line-soft' : ''} ${i !== 0 ? 'border-t sm:border-t-0 border-line-soft' : ''}`}>
            <div className="masthead text-3xl mb-3">{s.n}</div>
            <h3 className="head text-lg mb-1">{s.t}</h3>
            <p className="serif text-[#44443f] leading-snug">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Colophon */}
      <footer className="mt-10 flex flex-col sm:flex-row justify-between gap-2 tag">
        <span className="wordmark text-sm normal-case">Tfke.id</span>
        <span>© 2026 · encrypted in your browser · made in Indonesia</span>
      </footer>
    </div>
  );
}
