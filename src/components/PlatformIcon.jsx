import { platforms } from '../data/platforms';

export default function PlatformIcon({ platformId, size = 40 }) {
  const platform = platforms.find(p => p.id === platformId);
  if (!platform) return null;

  const initials = platform.name.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-xl font-bold text-white text-xs platform-glow-${platformId}`}
      style={{
        width: size,
        height: size,
        backgroundColor: platform.color,
      }}
    >
      {initials}
    </div>
  );
}
