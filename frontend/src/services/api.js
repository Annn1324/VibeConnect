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

export { API_URL };
