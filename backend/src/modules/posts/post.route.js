const PostController = require('./post.controller');
const authMiddleware = require('../auth/auth.middleware');
const express = require('express');
const validate = require('../../validation/validation.middleware');
const {
    createPostSchema,
    updatePostSchema,
    getPostsQuerySchema
} = require('../../validation/post.validation');
const { idParamSchema } = require('../../validation/common.validation');
const { uploadPostMedia } = require('../../middlewares/upload.middleware');
const router = express.Router();

// Route bài viết: luôn xác thực user trước, sau đó validate dữ liệu theo từng endpoint.
router.post('/', authMiddleware, uploadPostMedia, validate(createPostSchema), PostController.createPost);
router.get('/', authMiddleware, validate(getPostsQuerySchema, 'query'), PostController.getPosts);
router.get('/:id', authMiddleware, validate(idParamSchema, 'params'), PostController.getPostById);
router.put('/:id', authMiddleware, validate(idParamSchema, 'params'), validate(updatePostSchema), PostController.updatePost);
router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'),PostController.deletePost);

module.exports = router;
