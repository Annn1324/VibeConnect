const mongoose = require('mongoose');

// Schema bình luận, liên kết cả bài viết và người viết bình luận.
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
