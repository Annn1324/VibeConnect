const { v2: cloudinary } = require('cloudinary');

// Cấu hình Cloudinary từ biến môi trường để tránh hard-code thông tin nhạy cảm trong source code.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
