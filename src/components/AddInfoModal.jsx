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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/20" onClick={onClose} />
      <div className="relative figure p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="head text-2xl">Add payment info</h2>
          <button onClick={onClose} className="text-[#8a8a82] hover:text-ink"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="tag block mb-2">Platform</label>
            <div className="space-y-3 max-h-44 overflow-y-auto scrollbar-hide">
              {Object.entries(grouped).map(([cat, ps]) => (
                <div key={cat}>
                  <div className="tag mb-1.5">{categoryLabels[cat]}</div>
                  <div className="grid grid-cols-3 gap-px bg-line-soft border border-line-soft">
                    {ps.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatformId(p.id)}
                        className={`p-2 tag normal-case transition-colors ${
                          platformId === p.id ? 'bg-blue text-white' : 'bg-white text-[#44443f] hover:bg-[#fcfcf9]'
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
            { l: 'Value', v: value, set: setValue, ph: 'Username, phone, or account number', req: true },
            { l: 'Label (optional)', v: label, set: setLabel, ph: 'e.g. Phone, Account Number' },
            { l: 'Account name (optional)', v: accountName, set: setAccountName, ph: 'e.g. John Doe' },
          ].map((f) => (
            <div key={f.l}>
              <label className="tag block mb-2">{f.l}</label>
              <input value={f.v} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} required={f.req} className="field w-full px-3 py-2.5" />
            </div>
          ))}

          <button type="submit" className="btn-primary w-full py-3">Add info</button>
        </form>
      </div>
    </div>
  );
}
