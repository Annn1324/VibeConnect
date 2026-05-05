const { z } = require('zod');
const { objectId } = require('./common.validation');

// Schema tạo bình luận mới cho một post.
const createCommentSchema = z.object({
    postID: objectId,
    content: z
        .string()
        .trim()
        .min(1, 'Content is required')
        .max(300, 'Content must be less than 300 characters'),
});

// Query phân trang danh sách bình luận.
const getCommentsQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, 'Page must be at least 1')
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be less than or equal to 100')
        .default(10),
});

module.exports = {
    createCommentSchema,
    getCommentsQuerySchema
};
