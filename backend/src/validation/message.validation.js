const { z } = require('zod');

const createMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Message is required')
        .max(1000, 'Message must be less than 1000 characters'),
});

module.exports = {
    createMessageSchema
};
