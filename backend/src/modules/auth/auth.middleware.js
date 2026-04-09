const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('No token provided. Please log in to continue.', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = authMiddleware;
