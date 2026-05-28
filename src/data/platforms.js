export const platforms = [
  { id: 'dana', name: 'DANA', color: '#008CDC', category: 'ewallet' },
  { id: 'ovo', name: 'OVO', color: '#4F2878', category: 'ewallet' },
  { id: 'gopay', name: 'GoPay', color: '#008C8C', category: 'ewallet' },
  { id: 'linkaja', name: 'LinkAja', color: '#C83232', category: 'ewallet' },
  { id: 'flip', name: 'Flip', color: '#E84A5F', category: 'ewallet' },
  { id: 'bca', name: 'BCA', color: '#0064B4', category: 'bank' },
  { id: 'bni', name: 'BNI', color: '#00508C', category: 'bank' },
  { id: 'mandiri', name: 'Mandiri', color: '#FFC800', category: 'bank' },
  { id: 'bri', name: 'BRI', color: '#007850', category: 'bank' },
  { id: 'jenius', name: 'Jenius', color: '#00A0B4', category: 'bank' },
  { id: 'seabank', name: 'SeaBank', color: '#C85000', category: 'bank' },
  { id: 'cimb', name: 'CIMB Niaga', color: '#9B1C31', category: 'bank' },
  { id: 'binance', name: 'Binance Pay', color: '#F0B90B', category: 'crypto' },
];

export const categoryLabels = {
  ewallet: 'E-Wallet',
  bank: 'Bank / Digital',
  crypto: 'Crypto',
};

export function getPlatform(id) {
  return platforms.find((p) => p.id === id) || { id, name: id || 'Unknown', color: '#6b7280', category: 'other' };
}
