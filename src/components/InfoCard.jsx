import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import PlatformIcon from './PlatformIcon';
import { getPlatform } from '../data/platforms';

export default function InfoCard({ info }) {
  const [copied, setCopied] = useState(false);
  const platform = getPlatform(info.platformId);

  const handleCopy = async () => {
    const text = info.accountName ? `${info.value} (${info.accountName})` : info.value;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div onClick={handleCopy} className="group flex items-center gap-4 p-4 border border-ink bg-white cursor-pointer hover:bg-[#fcfcf9] transition-colors">
      <PlatformIcon platformId={info.platformId} size={42} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="tag">{platform.name}</span>
          {info.label && <span className="tag normal-case text-[#8a8a82]">· {info.label}</span>}
        </div>
        <div className="mono text-base text-ink truncate">{info.value}</div>
        {info.accountName && <div className="tag normal-case lowercase text-[#8a8a82]">a/n {info.accountName}</div>}
      </div>
      <span className={`tag shrink-0 ${copied ? 'text-[#0a7d4f]' : 'text-[#8a8a82] group-hover:text-blue'}`}>
        {copied ? <span className="inline-flex items-center gap-1"><Check size={13} /> copied</span> : <span className="inline-flex items-center gap-1"><Copy size={13} /> copy</span>}
      </span>
    </div>
  );
}
