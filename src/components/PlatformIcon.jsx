import { useState } from 'react';
import { getPlatform } from '../data/platforms';

// A platform mark rendered as a specimen cell: real logo on a white, hairline-
// framed square; falls back to mono initials when no logo file exists.
export default function PlatformIcon({ platformId, size = 40 }) {
  const [err, setErr] = useState(false);
  const platform = getPlatform(platformId);
  const initials = String(platform.name).slice(0, 2).toUpperCase();

  return (
    <div
      className="flex items-center justify-center bg-white border border-ink overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {!err ? (
        <img
          src={`/logos/${platformId}.png`}
          alt={platform.name}
          onError={() => setErr(true)}
          loading="lazy"
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <span className="pixel text-ink" style={{ fontSize: Math.max(9, size * 0.26) }}>{initials}</span>
      )}
    </div>
  );
}
