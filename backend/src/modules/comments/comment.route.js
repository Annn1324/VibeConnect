const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth.middleware');
const CommentController = require('./comment.controller');
const validate = require('../../validation/validation.middleware');
const { createCommentSchema, updateCommentSchema, getCommentsQuerySchema } = require('../../validation/comment.validation');
const { postIdParamSchema,idParamSchema } = require('../../validation/common.validation');

// Route bình luận: validate params/query/body trước khi controller xử lý nghiệp vụ.
router.post('/', authMiddleware, validate(createCommentSchema), CommentController.createComment);
router.get('/post/:postId', authMiddleware, validate(postIdParamSchema, 'params'), validate(getCommentsQuerySchema, 'query'), CommentController.getCommentsByPostId);
router.put('/:id', authMiddleware, validate(idParamSchema, 'params'), validate(updateCommentSchema), CommentController.updateComment);
router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'), CommentController.deleteComment);

module.exports = router;
