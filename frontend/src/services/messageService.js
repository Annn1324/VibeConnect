import { authorizedApiRequest } from './api';

const getErrorMessage = (data, fallbackMessage) => data?.message || fallbackMessage;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const getConversationUsers = async () => {
  const { ok, status, data } = await authorizedApiRequest('/messages/users');

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not load conversations.'));
  }

  return data;
};

export const getConversationMessages = async (userId) => {
  const { ok, status, data } = await authorizedApiRequest(`/messages/${userId}`);

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not load messages.'));
  }

  return data;
};

export const sendMessage = async (userId, content) => {
  const { ok, status, data } = await authorizedApiRequest(`/messages/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not send message.'));
  }

  return data;
};
