const { z } = require('zod');

const objectId = z.string().length(24, 'Invalid Id');

const idParamSchema = z.object({
    id: objectId
});

const postIdParamSchema = z.object({
    postId: objectId
});

module.exports = {
    objectId,
    idParamSchema,
    postIdParamSchema
};

