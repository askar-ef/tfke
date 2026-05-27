import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Link2, ExternalLink, Trash2, Edit3 } from 'lucide-react';
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
    if (!u) {
      navigate('/login');
      return;
    }
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
      const updated = { ...user, infos: user.infos.filter((i) => i.id !== infoId) };
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

  const sans = { fontFamily: 'var(--font-sans)' };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="label-mono mb-3">FIG · your page</div>

        {/* Profile header */}
        <div className="card rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0 mono"
              style={{ backgroundColor: '#2d4bff' }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="display text-2xl text-[#15161a]">{user.displayName}</h1>
              <p className="text-[#9a9ba1] text-sm mono">@{user.username}</p>

              {editingBio ? (
                <div className="mt-3 flex gap-2" style={sans}>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Add a bio…"
                    className="field flex-1 px-3 py-2 rounded-lg text-sm"
                    autoFocus
                  />
                  <button onClick={handleSaveBio} className="btn-primary px-4 py-2 rounded-lg text-sm">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2" style={sans}>
                  <p className="text-[#5f6066] text-sm">{user.bio || 'No bio yet'}</p>
                  <button onClick={() => { setBio(user.bio || ''); setEditingBio(true); }} className="p-1 rounded hover:bg-black/[0.04] text-[#9a9ba1]">
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share link */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3" style={sans}>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f4f4f0] border border-[rgba(20,21,26,0.10)]">
              <Link2 size={16} className="text-[#9a9ba1] shrink-0" />
              <span className="text-sm text-[#5f6066] truncate mono">{publicUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border ${
                copiedLink
                  ? 'bg-[#0a8f5b]/10 text-[#0a8f5b] border-[#0a8f5b]/20'
                  : 'bg-white text-[#15161a] border-[rgba(20,21,26,0.12)] hover:border-[rgba(20,21,26,0.24)]'
              }`}
            >
              {copiedLink ? 'Copied!' : 'Copy link'}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-lg bg-white text-[#5f6066] border border-[rgba(20,21,26,0.12)] hover:text-[#2d4bff] transition-colors flex items-center justify-center"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6" style={sans}>
          <div className="card rounded-xl p-5">
            <div className="display text-3xl text-[#15161a]">{user.infos.length}</div>
            <div className="label-mono mt-1">Payment infos</div>
          </div>
          <div className="card rounded-xl p-5">
            <div className="display text-3xl text-[#15161a]">{user.infos.length > 0 ? 'Active' : 'Empty'}</div>
            <div className="label-mono mt-1">Page status</div>
          </div>
        </div>

        {/* Payment infos */}
        <div className="flex items-center justify-between mb-4" style={sans}>
          <h2 className="display text-lg text-[#15161a]">Your payment infos</h2>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
            <Plus size={16} /> Add info
          </button>
        </div>

        {user.infos.length === 0 ? (
          <div className="card rounded-2xl p-12 text-center" style={sans}>
            <h3 className="display text-lg mb-2 text-[#15161a]">No payment info yet</h3>
            <p className="text-sm text-[#5f6066] mb-6">Add your first payment info to share with others</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary px-6 py-3 rounded-lg text-sm">
              Add payment info
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {user.infos.map((info) => (
              <div key={info.id} className="group relative">
                <InfoCard info={info} />
                <button
                  onClick={() => handleRemoveInfo(info.id)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-[#d23b3b]/10 text-[#d23b3b] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d23b3b]/20"
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
