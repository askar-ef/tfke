import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import PlatformIcon from './PlatformIcon';
import { getPlatform } from '../data/platforms';

export default function InfoCard({ info, showLabel = true }) {
  const [copied, setCopied] = useState(false);
  const platform = getPlatform(info.platformId);

  const handleCopy = async () => {
    const textToCopy = info.accountName ? `${info.value} (${info.accountName})` : info.value;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="group relative card card-hover rounded-xl p-4 cursor-pointer transition-colors"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="flex items-center gap-4">
        <PlatformIcon platformId={info.platformId} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#15161a]">{platform.name}</span>
            {showLabel && info.label && (
              <span className="label-mono px-1.5 py-0.5 rounded bg-[#f4f4f0]">{info.label}</span>
            )}
          </div>
          <div className="mono text-base font-semibold mt-0.5 truncate text-[#15161a]">{info.value}</div>
          {info.accountName && <div className="text-xs text-[#9a9ba1] mt-0.5">a/n {info.accountName}</div>}
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            copied ? 'bg-[#0a8f5b]/10 text-[#0a8f5b]' : 'bg-[#f4f4f0] text-[#5f6066] group-hover:text-[#2d4bff]'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </div>
      </div>
    </div>
  );
}
