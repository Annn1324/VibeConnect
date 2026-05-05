const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const AppError = require('./AppError');

// Upload file từ memory buffer của multer lên Cloudinary bằng stream, không cần lưu file tạm trên server.
const uploadBufferToCloudinary = (file, folder = 'vibeconnect/posts') =>
    new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return reject(new AppError('Cloudinary is not configured', 500));
        }

        // Cloudinary dùng callback nên bọc lại bằng Promise để controller có thể await.
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            }
        );

        // Đưa buffer vào upload stream để Cloudinary nhận dữ liệu file.
        Readable.from(file.buffer).pipe(uploadStream);
    });

module.exports = uploadBufferToCloudinary;
