const { z } = require('zod');
const { objectId } = require('./common.validation');

const createLikeSchema = z.object({
    postID: objectId
});

module.exports = {
    createLikeSchema
};
