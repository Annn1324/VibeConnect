const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const readJson = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const persistAuthSession = ({ token, user }, rememberMe = false) => {
  clearAuthSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  if (token) {
    storage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getAuthToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';

export const getStoredUser = () =>
  readJson(localStorage.getItem(USER_KEY)) || readJson(sessionStorage.getItem(USER_KEY));

export const isAuthenticated = () => Boolean(getAuthToken());
