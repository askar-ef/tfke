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
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="absolute inset-0 bg-[#15161a]/30" onClick={onClose} />
      <div className="relative card rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="display text-xl text-[#15161a]">Add payment info</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/[0.04]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-mono block mb-2">Platform</label>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {Object.entries(grouped).map(([cat, ps]) => (
                <div key={cat}>
                  <div className="label-mono mb-2">{categoryLabels[cat]}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {ps.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatformId(p.id)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
                          platformId === p.id
                            ? 'bg-[#2d4bff]/10 text-[#2d4bff] border-[#2d4bff]/40'
                            : 'bg-white text-[#5f6066] border-[rgba(20,21,26,0.12)] hover:border-[rgba(20,21,26,0.24)]'
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

          {[
            { l: 'Value', v: value, set: setValue, ph: 'Username, phone, or account number', req: true, mono: true },
            { l: 'Label (optional)', v: label, set: setLabel, ph: 'e.g. Phone, Account Number' },
            { l: 'Account name (optional)', v: accountName, set: setAccountName, ph: 'e.g. John Doe' },
          ].map((f) => (
            <div key={f.l}>
              <label className="label-mono block mb-2">{f.l}</label>
              <input
                type="text"
                value={f.v}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.ph}
                required={f.req}
                className={`field w-full px-4 py-3 rounded-lg text-sm ${f.mono ? 'mono' : ''}`}
              />
            </div>
          ))}

          <button type="submit" className="btn-primary w-full py-3 rounded-lg text-sm">
            Add info
          </button>
        </form>
      </div>
    </div>
  );
}
