const PostController = require('./post.controller');
const authMiddleware = require('../auth/auth.middleware');
const express = require('express');
const validate = require('../../validation/validation.middleware');
const { createPostSchema, getPostsQuerySchema } = require('../../validation/post.validation');
const { idParamSchema } = require('../../validation/common.validation');
const router = express.Router();

// Create a new post
router.post('/', authMiddleware, validate(createPostSchema), PostController.createPost);
router.get('/', authMiddleware, validate(getPostsQuerySchema, 'query'), PostController.getPosts);
router.get('/:id', authMiddleware, validate(idParamSchema, 'params'), PostController.getPostById);
router.put('/:id', authMiddleware, validate(idParamSchema, 'params'), PostController.updatePost);
router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'),PostController.deletePost);

module.exports = router;
