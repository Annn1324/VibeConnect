import { authorizedApiRequest } from './api';

const getErrorMessage = (data, fallbackMessage) => data?.message || fallbackMessage;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const getPosts = async (page = 1, limit = 20) => {
  const { ok, status, data } = await authorizedApiRequest(`/posts?page=${page}&limit=${limit}`);

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not load posts.'));
  }

  return data;
};

export const createPost = async (content) => {
  const { ok, status, data } = await authorizedApiRequest('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not publish post.'));
  }

  return data;
};

export const deletePost = async (postId) => {
  const { ok, status, data } = await authorizedApiRequest(`/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not delete post.'));
  }

  return data;
};

export const createLike = async (postId) => {
  const { ok, status, data } = await authorizedApiRequest('/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postID: postId }),
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not like this post.'));
  }

  return data;
};

export const deleteLike = async (likeId) => {
  const { ok, status, data } = await authorizedApiRequest(`/likes/${likeId}`, {
    method: 'DELETE',
  });

  if (!ok) {
    throw createHttpError(status, getErrorMessage(data, 'Could not remove like.'));
  }

  return data;
};
