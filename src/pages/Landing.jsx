import { Link } from 'react-router-dom';
import { Zap, Copy, Shield, Globe, ArrowRight, Check } from 'lucide-react';
import { platforms } from '../data/platforms';
import PlatformIcon from '../components/PlatformIcon';

export default function Landing() {
  const featuredPlatforms = platforms.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-glow-pulse" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-gray-400 mb-8 animate-fade-in-up">
            <Zap size={14} className="text-indigo-400" />
            Share payment info instantly
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black font-[Space_Grotesk] tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your payment info,<br />
            <span className="gradient-text">one link away</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Create a personal page with all your payment details. Share one link. 
            Others copy with a single click. No more typing back and forth.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/create" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all">
              Create now — no account
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-8 py-4 rounded-2xl glass text-gray-300 font-medium hover:bg-white/[0.08] transition-all">
              Sign in to keep &amp; edit
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-4">Instant link, no email — expires in 3 days. Sign in for a permanent, editable page.</p>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8 animate-fade-in-up">Supported platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            {featuredPlatforms.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PlatformIcon platformId={p.id} size={44} />
              </div>
            ))}
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xs text-gray-500 font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              +6
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[Space_Grotesk] mb-4">How it works</h2>
            <p className="text-gray-400">Three simple steps to share your payment info</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Create Account', desc: 'Sign up and set up your profile in seconds. No email verification needed.' },
              { icon: Copy, title: 'Add Your Info', desc: 'Add payment details for any platform. Username, phone, account number.' },
              { icon: Globe, title: 'Share Link', desc: 'Share your personal link. Others click and copy instantly.' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-3xl p-8 text-center hover:bg-white/[0.05] transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
                  <f.icon size={24} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold font-[Space_Grotesk] mb-4">Ready to simplify?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join others who stopped typing payment details over and over again.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold font-[Space_Grotesk]">Tfke.id</span>
          </div>
          <p className="text-sm text-gray-500">Share payment info, made simple.</p>
        </div>
      </footer>
    </div>
  );
}
