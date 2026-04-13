const AUTH_API_URL = 'http://localhost:5000/auth';

const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  ACCOUNT_NOT_FOUND: 'Account does not exist.',
  USER_NOT_FOUND: 'Account does not exist.',
  ACCOUNT_LOCKED: 'Account has been locked.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in.',
};

const parseResponseData = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
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

  switch (message?.toLowerCase()) {
    case 'email already exists':
      return 'This email is already registered.';
    case 'username already exists':
      return 'This username is already taken.';
    case 'user already exists':
      return 'This account already exists.';
    default:
      break;
  }

  if (status === 400 && message) {
    return message;
  }

  return message || 'Registration failed. Please try again.';
};

export const login = async (email, password) => {
  const res = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseResponseData(res);

  if (!res.ok) {
    throw new Error(getFriendlyLoginError(data, res.status));
  }

  return data;
};

export const register = async ({ fullname, email, username, password }) => {
  const res = await fetch(`${AUTH_API_URL}/register`, {
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

  const data = await parseResponseData(res);

  if (!res.ok) {
    throw new Error(getFriendlyRegisterError(data, res.status));
  }

  return data;
};
