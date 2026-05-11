const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const MessageController = require('./message.controller');
const validate = require('../../validation/validation.middleware');
const { idParamSchema } = require('../../validation/common.validation');
const { createMessageSchema } = require('../../validation/message.validation');

const router = express.Router();

router.get('/users', authMiddleware, MessageController.getConversationUsers);
router.get('/:id', authMiddleware, validate(idParamSchema, 'params'), (req, res, next) => {
    req.params.userId = req.params.id;
    return MessageController.getConversationMessages(req, res, next);
});
router.post('/:id', authMiddleware, validate(idParamSchema, 'params'), validate(createMessageSchema), (req, res, next) => {
    req.params.userId = req.params.id;
    return MessageController.createMessage(req, res, next);
});

module.exports = router;
