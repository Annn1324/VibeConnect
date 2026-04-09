const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const { registerSchema, loginSchema } = require('../../validation/auth.validation');
const validate = require('../../validation/validation.middleware');

// auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;