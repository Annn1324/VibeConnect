import { authorizedApiRequest } from './api';

const getErrorMessage = (data, fallbackMessage) => data?.message || fallbackMessage;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const getCommentsByPostId = async (postId, page = 1, limit = 20) => {
  const { ok, status, data } = await authorizedApiRequest(
    `/comments/post/${postId}?page=${page}&limit=${limit}`,
  );

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not load comments.'));
  }

  return data;
};

export const createComment = async (postId, content) => {
  const { ok, status, data } = await authorizedApiRequest('/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postID: postId,
      content,
    }),
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not publish comment.'));
  }

  return data;
};

export const deleteComment = async (commentId) => {
  const { ok, status, data } = await authorizedApiRequest(`/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not delete comment.'));
  }

  return data;
};
