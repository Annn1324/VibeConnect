const AppError = require('../utils/AppError');

// Middleware validate dữ liệu request bằng Zod. source có thể là body, params hoặc query.
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const data = req[source];
        const result = schema.safeParse(data);

        if (!result.success) {
            // Gom toàn bộ lỗi validate thành một message để client hiển thị dễ hơn.
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(', ');

            return next(new AppError(message, 400));
        }

        // Gán lại dữ liệu đã parse để controller nhận giá trị đã trim/coerce/default.
        req[source] = result.data;
        return next();
    };
};

module.exports = validate;
