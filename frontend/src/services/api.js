import { getAuthToken } from './authStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseResponseData = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await parseResponseData(response);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const createAuthHeaders = (headers = {}) => {
  const token = getAuthToken();

  return token
    ? {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    : headers;
};

export const authorizedApiRequest = (path, options = {}) =>
  apiRequest(path, {
    ...options,
    headers: createAuthHeaders(options.headers),
  });

export { API_URL };
