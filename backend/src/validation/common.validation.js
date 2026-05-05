const { z } = require('zod');

// ObjectId của MongoDB có 24 ký tự hex; rule này dùng chung cho params/body.
const objectId = z.string().length(24, 'Invalid Id');

// Validate route param dạng /:id.
const idParamSchema = z.object({
    id: objectId
});

// Validate route param dạng /post/:postId.
const postIdParamSchema = z.object({
    postId: objectId
});

module.exports = {
    objectId,
    idParamSchema,
    postIdParamSchema
};

