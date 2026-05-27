import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Link2, ExternalLink, Trash2, User, Edit3 } from 'lucide-react';
import InfoCard from '../components/InfoCard';
import AddInfoModal from '../components/AddInfoModal';
import { addInfo, removeInfo, updateUser } from '../data/mockUsers';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('tfke_user');
    if (!u) { navigate('/login'); return; }
    setUser(JSON.parse(u));
  }, [navigate]);

  if (!user) return null;

  const publicUrl = `${window.location.origin}/u/${user.username}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddInfo = (info) => {
    const newInfo = addInfo(user.username, info);
    if (newInfo) {
      const updated = { ...user, infos: [...user.infos, newInfo] };
      setUser(updated);
      localStorage.setItem('tfke_user', JSON.stringify(updated));
    }
  };

  const handleRemoveInfo = (infoId) => {
    if (removeInfo(user.username, infoId)) {
      const updated = { ...user, infos: user.infos.filter(i => i.id !== infoId) };
      setUser(updated);
      localStorage.setItem('tfke_user', JSON.stringify(updated));
    }
  };

  const handleSaveBio = () => {
    updateUser(user.username, { bio });
    const updated = { ...user, bio };
    setUser(updated);
    localStorage.setItem('tfke_user', JSON.stringify(updated));
    setEditingBio(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-6 sm:p-8 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold font-[Space_Grotesk]">{user.displayName}</h1>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              
              {editingBio ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Add a bio..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50"
                    autoFocus
                  />
                  <button onClick={handleSaveBio} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-gray-400 text-sm">{user.bio || 'No bio yet'}</p>
                  <button onClick={() => { setBio(user.bio || ''); setEditingBio(true); }} className="p-1 rounded-lg hover:bg-white/5 text-gray-500">
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share Link */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Link2 size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm text-gray-400 truncate">{publicUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                copiedLink
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/[0.06]'
              }`}
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-2xl p-5">
            <div className="text-3xl font-bold font-[Space_Grotesk]">{user.infos.length}</div>
            <div className="text-sm text-gray-500 mt-1">Payment Infos</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-3xl font-bold font-[Space_Grotesk]">{user.infos.length > 0 ? 'Active' : 'Empty'}</div>
            <div className="text-sm text-gray-500 mt-1">Page Status</div>
          </div>
        </div>

        {/* Payment Infos */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold">Your Payment Infos</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <Plus size={16} />
            Add Info
          </button>
        </div>

        {user.infos.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No payment info yet</h3>
            <p className="text-sm text-gray-500 mb-6">Add your first payment info to share with others</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Add Payment Info
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {user.infos.map((info, i) => (
              <div key={info.id} className="group relative animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <InfoCard info={info} />
                <button
                  onClick={() => handleRemoveInfo(info.id)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddInfoModal onClose={() => setShowAdd(false)} onAdd={handleAddInfo} />}
    </div>
  );
}
