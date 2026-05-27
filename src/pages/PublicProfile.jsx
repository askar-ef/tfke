import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import InfoCard from '../components/InfoCard';
import { getUser } from '../data/mockUsers';
import { getPlatform } from '../data/platforms';

export default function PublicProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUser(getUser(username));
    setLoading(false);
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#2d4bff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
        <div>
          <h1 className="display text-2xl mb-2 text-[#15161a]">User not found</h1>
          <p className="text-[#5f6066] mb-6">This page doesn’t exist.</p>
          <Link to="/" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm">
            <ArrowLeft size={16} /> Go home
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyAll = async () => {
    const text = user.infos
      .map((i) => {
        const platform = getPlatform(i.platformId);
        return `${platform.name}: ${i.value}${i.accountName ? ` (${i.accountName})` : ''}`;
      })
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="label-mono mb-3">FIG · shared payment info</div>
        <div className="card rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0 mono"
              style={{ backgroundColor: '#2d4bff' }}
            >
              {user.avatar}
            </div>
            <div>
              <h1 className="display text-2xl text-[#15161a]">{user.displayName}</h1>
              <p className="text-[#9a9ba1] text-sm mono">@{user.username}</p>
              {user.bio && <p className="text-[#5f6066] text-sm mt-2" style={{ fontFamily: 'var(--font-sans)' }}>{user.bio}</p>}
            </div>
          </div>

          {user.infos.length > 0 && (
            <button
              onClick={handleCopyAll}
              style={{ fontFamily: 'var(--font-sans)' }}
              className={`mt-6 w-full py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border ${
                copied
                  ? 'bg-[#0a8f5b]/10 text-[#0a8f5b] border-[#0a8f5b]/20'
                  : 'bg-white text-[#15161a] border-[rgba(20,21,26,0.12)] hover:border-[rgba(20,21,26,0.24)]'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'All copied!' : 'Copy all'}
            </button>
          )}
        </div>

        <hr className="rule mb-6" />

        {user.infos.length === 0 ? (
          <div className="card rounded-2xl p-12 text-center text-[#9a9ba1]" style={{ fontFamily: 'var(--font-sans)' }}>
            No payment info yet
          </div>
        ) : (
          <div className="space-y-3">
            {user.infos.map((info) => (
              <InfoCard key={info.id} info={info} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="label-mono hover:text-[#2d4bff] transition-colors">
            Powered by Tfke.id
          </Link>
        </div>
      </div>
    </div>
  );
}
