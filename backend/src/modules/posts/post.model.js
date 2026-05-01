const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: {
        url: String,
        publicId: String,
        resourceType: {
            type: String,
            enum: ['image', 'video', 'raw']
        },
        format: String,
        bytes: Number,
        width: Number,
        height: Number,
        duration: Number
    },
    createdAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);
