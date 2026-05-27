import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import PlatformIcon from './PlatformIcon';
import { platforms } from '../data/platforms';

export default function InfoCard({ info, showLabel = true }) {
  const [copied, setCopied] = useState(false);
  const platform = platforms.find(p => p.id === info.platformId);

  const handleCopy = async () => {
    const textToCopy = info.accountName
      ? `${info.value} (${info.accountName})`
      : info.value;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!platform) return null;

  return (
    <div
      onClick={handleCopy}
      className="group relative glass glass-hover rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
      style={{ animationDelay: `${Math.random() * 0.3}s` }}
    >
      <div className="flex items-center gap-4">
        <PlatformIcon platformId={info.platformId} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{platform.name}</span>
            {showLabel && info.label && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                {info.label}
              </span>
            )}
          </div>
          <div className="font-mono text-lg font-bold mt-0.5 truncate">
            {info.value}
          </div>
          {info.accountName && (
            <div className="text-xs text-gray-500 mt-0.5">{info.accountName}</div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          copied
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white'
        }`}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </div>
      </div>
    </div>
  );
}
