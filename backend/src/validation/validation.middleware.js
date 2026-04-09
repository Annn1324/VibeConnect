const AppError = require('../utils/AppError');

const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const data = req[source];
        const result = schema.safeParse(data);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(', ');

            return next(new AppError(message, 400));
        }

        req[source] = result.data;
        return next();
    };
};

module.exports = validate;
