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

export const createPost = async (content, mediaFiles = []) => {
  const requestOptions = {
    method: 'POST',
  };
  const files = Array.isArray(mediaFiles) ? mediaFiles : (mediaFiles ? [mediaFiles] : []);

  if (files.length) {
    const formData = new FormData();
    formData.append('content', content);
    files.forEach((mediaFile) => {
      formData.append('media', mediaFile);
    });
    requestOptions.body = formData;
  } else {
    requestOptions.headers = {
      'Content-Type': 'application/json',
    };
    requestOptions.body = JSON.stringify({ content });
  }

  const { ok, status, data } = await authorizedApiRequest('/posts', requestOptions);

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
