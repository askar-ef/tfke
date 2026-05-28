import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink, Trash2, Edit3 } from 'lucide-react';
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

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-24 pb-16">
      <div className="tag">Fig. — your page</div>

      <div className="flex items-start gap-4 mt-2">
        <div className="w-14 h-14 border border-ink bg-white flex items-center justify-center pixel text-blue text-2xl shrink-0">
          {String(user.avatar || user.displayName?.[0] || '?').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="head text-4xl leading-none">{user.displayName}</h1>
          <p className="tag mt-1">@{user.username}</p>
          {editingBio ? (
            <div className="mt-3 flex gap-2">
              <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Add a bio…" className="field flex-1 px-3 py-2" autoFocus />
              <button onClick={handleSaveBio} className="btn-primary px-4">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <p className="serif text-[#44443f]">{user.bio || 'No bio yet'}</p>
              <button onClick={() => { setBio(user.bio || ''); setEditingBio(true); }} className="text-[#8a8a82] hover:text-ink"><Edit3 size={14} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Share link */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-ink bg-white">
          <span className="mono text-sm text-[#44443f] truncate">{publicUrl}</span>
        </div>
        <button onClick={handleCopyLink} className="btn-ghost px-5 py-2.5">{copiedLink ? 'Copied!' : 'Copy link'}</button>
        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2.5 flex items-center justify-center"><ExternalLink size={16} /></a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border border-ink mt-6">
        <div className="p-5 border-r border-line-soft">
          <div className="masthead text-3xl text-ink">{String(user.infos.length).padStart(2, '0')}</div>
          <div className="tag mt-1">Payment infos</div>
        </div>
        <div className="p-5">
          <div className="head text-3xl">{user.infos.length > 0 ? 'Active' : 'Empty'}</div>
          <div className="tag mt-1">Page status</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-7 mb-3">
        <h2 className="head text-xl">Your payment infos</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2"><Plus size={14} /> Add info</button>
      </div>

      {user.infos.length === 0 ? (
        <div className="figure p-10 text-center">
          <h3 className="head text-lg mb-2">No payment info yet</h3>
          <p className="tag mb-5">Add your first payment info to share with others</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary px-6 py-2.5">Add payment info</button>
        </div>
      ) : (
        <div className="space-y-px">
          {user.infos.map((info) => (
            <div key={info.id} className="group relative">
              <InfoCard info={info} />
              <button onClick={() => handleRemoveInfo(info.id)} className="absolute top-2 right-2 p-1.5 bg-white border border-[#cc2b2b] text-[#cc2b2b] opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddInfoModal onClose={() => setShowAdd(false)} onAdd={handleAddInfo} />}
    </div>
  );
}
