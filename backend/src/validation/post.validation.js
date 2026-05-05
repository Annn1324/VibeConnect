const { z } = require('zod');


// Nội dung post bắt buộc có chữ sau khi trim và giới hạn độ dài để tránh payload quá lớn.
const createPostSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Content is required')
        .max(500, 'Content must be less than 500 characters'),
});

// Hiện tại update post dùng cùng rule với create post.
const updatePostSchema = createPostSchema;

// Query phân trang: z.coerce chuyển string từ URL thành number.
const getPostsQuerySchema = z.object({
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
    createPostSchema,
    updatePostSchema,
    getPostsQuerySchema
};
