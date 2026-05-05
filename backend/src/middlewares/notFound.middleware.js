const AppError = require('../utils/AppError');

// Đẩy các route không tồn tại vào error middleware để response lỗi có format thống nhất.
const notFoundMiddleware = (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = notFoundMiddleware;
