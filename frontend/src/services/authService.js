import { apiRequest } from './api';

const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  ACCOUNT_NOT_FOUND: 'Account does not exist.',
  USER_NOT_FOUND: 'Account does not exist.',
  ACCOUNT_LOCKED: 'Account has been locked.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in.',
};

const getFriendlyLoginError = (data, status) => {
  const code = data?.code;
  const message = data?.message?.trim();

  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  switch (message?.toLowerCase()) {
    case 'invalid credentials':
      return 'Email or password is incorrect.';
    case 'account not found':
    case 'account does not exist':
    case 'user not found':
      return 'Account does not exist.';
    case 'account locked':
      return 'Account has been locked.';
    case 'email not verified':
      return 'Please verify your email before signing in.';
    default:
      break;
  }

  if (status === 401) {
    return 'Email or password is incorrect.';
  }

  if (status === 404) {
    return 'Account does not exist.';
  }

  return message || 'Sign in failed. Please try again.';
};

const getFriendlyRegisterError = (data, status) => {
  const message = data?.message?.trim();

  if (status === 400 && message) {
    return message;
  }

  return message || 'Registration failed. Please try again.';
};

export const login = async (email, password) => {
  const { ok, status, data } = await apiRequest('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!ok) {
    throw new Error(getFriendlyLoginError(data, status));
  }

  return data;
};

export const register = async ({ fullname, email, username, password }) => {
  const { ok, status, data } = await apiRequest('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullname,
      email,
      username,
      password,
    }),
  });

  if (!ok) {
    throw new Error(getFriendlyRegisterError(data, status));
  }

  return data;
};
