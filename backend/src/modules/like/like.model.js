const mongoose = require('mongoose');

// Schema like, mỗi document thể hiện một user đã like một post.
const commentSchema = new mongoose.Schema({
    postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
},
    {
        timestamps: true
    }
);

commentSchema.index({ postID: 1, authorID: 1 }, { unique: true });

module.exports = mongoose.model('Like', commentSchema);
