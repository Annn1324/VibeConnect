const mongoose = require('mongoose');

// Metadata media lưu sau khi upload lên Cloudinary.
const mediaSchema = new mongoose.Schema({
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
}, { _id: false });

// Schema bài viết. authorID liên kết tới User để populate thông tin tác giả khi trả response.
const postSchema = new mongoose.Schema({
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    // Để undefined khi không có media, giúp document gọn hơn thay vì lưu mảng rỗng mặc định.
    media: {
        type: [mediaSchema],
        default: undefined
    },
    createdAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);
