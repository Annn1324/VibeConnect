const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) =>
    new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(`${duplicatedField} already exists`, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((item) => item.message);
    return new AppError(errors.join(', '), 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    console.error('ERROR', err);

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};

const errorMiddleware = (err, req, res, next) => {
    let error = err;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(error, res);
    }

    if (error.name === 'CastError') {
        error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
        error = handleValidationErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
        error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    }

    return sendErrorProd(error, res);
};

module.exports = errorMiddleware;
