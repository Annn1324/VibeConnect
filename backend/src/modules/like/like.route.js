const LikeController = require('./like.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth.middleware');
const validate = require('../../validation/validation.middleware');
const { createLikeSchema } = require('../../validation/like.validation');
const { postIdParamSchema, idParamSchema } = require('../../validation/common.validation');

// Route like: tạo/xem/xoá like đều yêu cầu user đã đăng nhập.
router.post('/', authMiddleware, validate(createLikeSchema), LikeController.createLike);
router.get('/post/:postId', authMiddleware, validate(postIdParamSchema, 'params'), LikeController.getLikesByPostId);
router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'), LikeController.deleteLike);

module.exports = router;
