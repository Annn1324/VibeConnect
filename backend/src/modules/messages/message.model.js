const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readAt: { type: Date, default: null }
}, {
    timestamps: true
});

messageSchema.index({ senderID: 1, receiverID: 1, createdAt: -1 });
messageSchema.index({ receiverID: 1, senderID: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
