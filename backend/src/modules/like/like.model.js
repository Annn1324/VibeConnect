const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
},
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Like', commentSchema);