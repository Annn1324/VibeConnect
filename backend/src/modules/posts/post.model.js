const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);