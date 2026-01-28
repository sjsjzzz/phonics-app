import { STORAGE_KEY } from './constants';

export const loadAppData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save:', e);
  }
};

export const loadUsers = () => {
  const data = loadAppData();
  return data?.users || [];
};

export const saveUsers = (users) => {
  saveAppData({ users });
};
