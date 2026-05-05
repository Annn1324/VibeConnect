const { z } = require('zod');
const { objectId } = require('./common.validation');

// Khi tạo like chỉ cần biết post nào đang được like; user lấy từ token.
const createLikeSchema = z.object({
    postID: objectId
});

module.exports = {
    createLikeSchema
};
