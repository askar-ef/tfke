import { Link } from 'react-router-dom';
import { Zap, Copy, Shield, Globe, ArrowRight, Check } from 'lucide-react';
import { platforms } from '../data/platforms';
import PlatformIcon from '../components/PlatformIcon';

export default function Landing() {
  const featuredPlatforms = platforms.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="wordmark text-2xl sm:text-3xl mb-6 animate-fade-in-up">Tfke.id</div>

          <h1
            className="display text-4xl sm:text-6xl leading-[1.05] mb-6 text-[#15161a] animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            Your payment info,<br />
            <span className="gradient-text">one link away.</span>
          </h1>

          <p
            className="text-lg text-[#5f6066] max-w-xl mx-auto mb-9 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', fontFamily: 'var(--font-sans)' }}
          >
            Put your bank and e-wallet details on one page. Share the link.
            Others copy with a single tap — no more typing it out.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: '0.3s', fontFamily: 'var(--font-sans)' }}
          >
            <Link to="/create" className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-xl">
              Create now — no account
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-ghost flex items-center gap-2 px-7 py-3.5 rounded-xl">
              Sign in to keep &amp; edit
            </Link>
          </div>
          <p className="label-mono mt-5">Instant link · no email · expires in 3 days</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6"><hr className="rule" /></div>

      {/* Platforms */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="label-mono text-center mb-8 animate-fade-in-up">Supported platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            {featuredPlatforms.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PlatformIcon platformId={p.id} size={44} />
              </div>
            ))}
            <div className="w-11 h-11 rounded-xl card flex items-center justify-center text-xs text-[#5f6066] font-medium animate-fade-in-up" style={{ animationDelay: '0.4s', fontFamily: 'var(--font-sans)' }}>
              +6
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="display text-3xl sm:text-4xl mb-3 text-[#15161a]">How it works</h2>
            <p className="text-[#5f6066]" style={{ fontFamily: 'var(--font-sans)' }}>Three steps to share your payment info</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, n: '001', title: 'Create', desc: 'Add your bank and e-wallet details. No account needed for a quick link.' },
              { icon: Copy, n: '002', title: 'Encrypt', desc: 'Your details are encrypted in your browser before they ever leave it.' },
              { icon: Globe, n: '003', title: 'Share', desc: 'Send the link. Others open it and copy your details in one tap.' },
            ].map((f, i) => (
              <div key={i} className="card rounded-2xl p-7 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-center justify-between mb-5">
                  <f.icon size={22} className="text-[#2d4bff]" />
                  <span className="label-mono">FIG.{f.n}</span>
                </div>
                <h3 className="display text-lg mb-2 text-[#15161a]">{f.title}</h3>
                <p className="text-sm text-[#5f6066] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto card rounded-2xl p-10 sm:p-14 text-center">
          <h2 className="display text-3xl sm:text-4xl mb-3 text-[#15161a]">Ready to simplify?</h2>
          <p className="text-[#5f6066] mb-8 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Stop typing payment details over and over again.
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl">
            Create your link
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[rgba(20,21,26,0.10)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="wordmark text-base">Tfke.id</span>
          <p className="label-mono">Share payment info, made simple.</p>
        </div>
      </footer>
    </div>
  );
}
