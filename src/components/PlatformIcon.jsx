import { getPlatform } from '../data/platforms';

export default function PlatformIcon({ platformId, size = 40 }) {
  const platform = getPlatform(platformId);
  const initials = String(platform.name).slice(0, 2).toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-md font-bold text-white text-xs mono"
      style={{ width: size, height: size, backgroundColor: platform.color }}
    >
      {initials}
    </div>
  );
}
