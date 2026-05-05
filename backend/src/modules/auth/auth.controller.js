const User = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// Đăng ký tài khoản mới, kiểm tra trùng email/username trước khi tạo user.
exports.register = catchAsync(async (req, res) => {
    const { fullname, username, email, password } = req.body;
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new AppError('Email already exists', 400);
        }

        throw new AppError('Username already exists', 400);
    }

    // Luôn hash password trước khi lưu database, không lưu mật khẩu dạng plain text.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullname,
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message: 'Register successful',
        user: {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        }
    });
});


// Đăng nhập bằng email/password và trả JWT cho client dùng ở các request cần xác thực.
exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('Invalid credentials', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 400);
    }

    // Token chỉ chứa userId để middleware lấy lại danh tính user ở request sau.
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        }
    });
});

// Trả thông tin user hiện tại dựa trên token đã được auth middleware giải mã.
exports.getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.json(user);
});
