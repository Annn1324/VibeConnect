const multer = require('multer');
const AppError = require('../utils/AppError');

// Lưu file trong RAM để upload thẳng lên Cloudinary, không ghi file tạm vào ổ đĩa.
const storage = multer.memoryStorage();

// Chỉ cho phép media đúng mục đích của bài viết: ảnh hoặc video.
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        return cb(null, true);
    }

    return cb(new AppError('Only image and video files are allowed', 400));
};

// Giới hạn mỗi file 50MB để tránh request quá nặng.
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

// Middleware upload media cho post: tối đa 4 file trong field "media".
exports.uploadPostMedia = (req, res, next) => {
    upload.array('media', 4)(req, res, (err) => {
        if (!err) {
            return next();
        }

        // Chuẩn hoá lỗi vượt quá dung lượng thành AppError để error middleware xử lý.
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('Media file must be 50MB or smaller', 400));
        }

        return next(err);
    });
};
