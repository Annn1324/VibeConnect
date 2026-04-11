const AUTH_API_URL = 'http://localhost:5000/auth';

const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại',
  USER_NOT_FOUND: 'Tài khoản không tồn tại',
  ACCOUNT_LOCKED: 'Tài khoản đã bị khóa',
  EMAIL_NOT_VERIFIED: 'Vui lòng xác minh email trước khi đăng nhập',
};

const getFriendlyLoginError = (data, status) => {
  const code = data?.code;
  const message = data?.message?.trim();

  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  switch (message?.toLowerCase()) {
    case 'invalid credentials':
      return 'Email hoặc mật khẩu không đúng';
    case 'account not found':
    case 'account does not exist':
    case 'user not found':
      return 'Tài khoản không tồn tại';
    case 'account locked':
      return 'Tài khoản đã bị khóa';
    case 'email not verified':
      return 'Vui lòng xác minh email trước khi đăng nhập';
    default:
      break;
  }

  if (status === 401) {
    return 'Email hoặc mật khẩu không đúng';
  }

  if (status === 404) {
    return 'Tài khoản không tồn tại';
  }

  return message || 'Đăng nhập thất bại. Vui lòng thử lại.';
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

  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(getFriendlyLoginError(data, res.status));
  }

  return data;
};
