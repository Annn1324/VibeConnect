const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Comment', commentSchema);