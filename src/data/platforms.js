export const platforms = [
  { id: 'shopee', name: 'Shopee', color: '#EE4D2D', category: 'ecommerce' },
  { id: 'tokopedia', name: 'Tokopedia', color: '#42B549', category: 'ecommerce' },
  { id: 'lazada', name: 'Lazada', color: '#0F69B4', category: 'ecommerce' },
  { id: 'dana', name: 'DANA', color: '#008CDC', category: 'ewallet' },
  { id: 'ovo', name: 'OVO', color: '#4F2878', category: 'ewallet' },
  { id: 'gopay', name: 'GoPay', color: '#008C8C', category: 'ewallet' },
  { id: 'linkaja', name: 'LinkAja', color: '#C83232', category: 'ewallet' },
  { id: 'bca', name: 'BCA', color: '#0064B4', category: 'bank' },
  { id: 'bni', name: 'BNI', color: '#00508C', category: 'bank' },
  { id: 'mandiri', name: 'Mandiri', color: '#FFC800', category: 'bank' },
  { id: 'bri', name: 'BRI', color: '#007850', category: 'bank' },
  { id: 'jenius', name: 'Jenius', color: '#00A0B4', category: 'bank' },
  { id: 'seabank', name: 'SeaBank', color: '#C85000', category: 'bank' },
  { id: 'blipay', name: 'Blipay', color: '#B43296', category: 'ewallet' },
];

export const categoryLabels = {
  ecommerce: 'E-Commerce',
  ewallet: 'E-Wallet',
  bank: 'Bank Transfer',
};

// Safe lookup: the backend owns the platformId allowlist, this file owns the
// display registry, and the two can drift — so an unknown id must render a
// neutral fallback rather than crash.
export function getPlatform(id) {
  return platforms.find((p) => p.id === id) || { id, name: id || 'Unknown', color: '#6b7280', category: 'other' };
}
