const { z } = require('zod');

const registerSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),

    username: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters'),

    email: z
        .string()
        .trim()
        .email('Invalid email'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email('Invalid email'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
});

module.exports = {
    registerSchema,
    loginSchema
};
