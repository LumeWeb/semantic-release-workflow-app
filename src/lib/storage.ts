const STORAGE_KEY = 'github_token';

export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEY),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEY, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEY),
};