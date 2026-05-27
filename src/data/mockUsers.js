export const mockUsers = {
  askar: {
    username: 'askar',
    displayName: 'Askar',
    bio: 'Software Engineer | Building things',
    avatar: 'A',
    infos: [
      { id: 1, platformId: 'shopee', value: 'askar_shopee', label: 'Username' },
      { id: 2, platformId: 'tokopedia', value: 'askar_tokopedia', label: 'Username' },
      { id: 3, platformId: 'dana', value: '081234567890', label: 'Phone' },
      { id: 4, platformId: 'bca', value: '1234567890', label: 'Account Number', accountName: 'Askar Efendi' },
    ],
  },
};

export function getUser(username) {
  return mockUsers[username.toLowerCase()] || null;
}

export function createUser(username, displayName, password) {
  const user = {
    username: username.toLowerCase(),
    displayName,
    bio: '',
    avatar: displayName.charAt(0).toUpperCase(),
    infos: [],
  };
  mockUsers[user.username] = user;
  return user;
}

export function addInfo(username, info) {
  const user = mockUsers[username.toLowerCase()];
  if (!user) return null;
  const newInfo = { ...info, id: Date.now() };
  user.infos.push(newInfo);
  return newInfo;
}

export function removeInfo(username, infoId) {
  const user = mockUsers[username.toLowerCase()];
  if (!user) return false;
  user.infos = user.infos.filter(i => i.id !== infoId);
  return true;
}

export function updateUser(username, updates) {
  const user = mockUsers[username.toLowerCase()];
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}
