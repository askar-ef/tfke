import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
        <div className="tag">loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 text-center">
        <div>
          <div className="tag mb-3">Fig. — 404</div>
          <h1 className="head text-3xl mb-4">User not found</h1>
          <Link to="/" className="btn-ghost inline-block px-6 py-2.5">Go home</Link>
        </div>
      </div>
    );
  }

  const handleCopyAll = async () => {
    const text = user.infos
      .map((i) => {
        const platformName = i.platform_id || i.platformId;
        const val = i.value;
        const an = i.account_name || i.accountName;
        return `${platformName}: ${val}${an ? ` (${an})` : ''}`;
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
    <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-24 pb-16">
      <div className="tag">tfke.id/u/{user.username}</div>
      <div className="flex items-start gap-4 mt-2">
        <div className="w-14 h-14 border border-ink bg-white flex items-center justify-center pixel text-blue text-2xl shrink-0">
          {String(user.avatar || user.display_name?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <h1 className="head text-4xl leading-none">{user.display_name}</h1>
          <p className="tag mt-1">@{user.username}</p>
        </div>
      </div>
      {user.bio && <p className="serif text-[#44443f] mt-3">{user.bio}</p>}

      {user.infos.length > 0 && (
        <button onClick={handleCopyAll} className="btn-ghost w-full py-2.5 mt-5">
          {copied ? 'All copied!' : 'Copy all'}
        </button>
      )}

      <hr className="rule my-7" />
      <div className="tag mb-3">Fig. 001 · payment details</div>

      {user.infos.length === 0 ? (
        <div className="figure p-10 text-center tag">No payment info yet</div>
      ) : (
        <div className="space-y-px">
          {user.infos.map((info) => (
            <InfoCard key={info.id} info={info} />
          ))}
        </div>
      )}

      <footer className="mt-10 tag text-center">
        <Link to="/" className="hover:text-blue">Powered by Tfke.id</Link>
      </footer>
    </div>
  );
}
