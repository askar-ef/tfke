import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, Copy, Check, ArrowLeft } from 'lucide-react';
import InfoCard from '../components/InfoCard';
import { users } from '../data/api';

export default function PublicProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    try {
      const data = await users.get(username);
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-gray-500 mb-6">This page does not exist</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all">
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyAll = async () => {
    const text = user.infos.map(i => {
      return `${i.platform_id}: ${i.value}${i.account_name ? ` (${i.account_name})` : ''}`;
    }).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="glass rounded-3xl p-6 sm:p-8 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[Space_Grotesk]">{user.display_name}</h1>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              {user.bio && <p className="text-gray-400 text-sm mt-2">{user.bio}</p>}
            </div>
          </div>

          {user.infos.length > 0 && (
            <button
              onClick={handleCopyAll}
              className={`mt-6 w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/[0.06]'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'All Copied!' : 'Copy All'}
            </button>
          )}
        </div>

        {/* Payment Infos */}
        <h2 className="text-lg font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Payment Infos
        </h2>

        {user.infos.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-gray-500">No payment info yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.infos.map((info, i) => (
              <div key={info.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <InfoCard info={info} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            Powered by Tfke.id
          </Link>
        </div>
      </div>
    </div>
  );
}
