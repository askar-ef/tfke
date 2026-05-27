import { useState } from 'react';
import { X } from 'lucide-react';
import { platforms, categoryLabels } from '../data/platforms';

export default function AddInfoModal({ onClose, onAdd }) {
  const [platformId, setPlatformId] = useState('');
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!platformId || !value) return;
    onAdd({ platformId, value, label: label || 'Info', accountName });
    onClose();
  };

  const grouped = platforms.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-[Space_Grotesk]">Add Payment Info</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {Object.entries(grouped).map(([cat, ps]) => (
                <div key={cat}>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{categoryLabels[cat]}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {ps.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatformId(p.id)}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${
                          platformId === p.id
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Value</label>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Username, phone, or account number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Label (optional)</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Phone, Account Number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Account Name (optional)</label>
            <input
              type="text"
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            Add Info
          </button>
        </form>
      </div>
    </div>
  );
}
