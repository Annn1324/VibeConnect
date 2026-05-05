const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import cấu hình kết nối database và các middleware dùng chung cho toàn app.
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const authRoutes = require('./modules/auth/auth.route');
const postRoutes = require('./modules/posts/post.route');
const commentRoutes = require('./modules/comments/comment.route');
const likeRoutes = require('./modules/like/like.route');

// Kết nối MongoDB khi app khởi động.
connectDB();

// Khởi tạo Express app.
const app = express();

// Cho phép frontend gọi API kèm cookie/header xác thực theo CLIENT_URL cấu hình.
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());


// Route kiểm tra nhanh API có đang chạy hay không.
app.get('/', (req, res) => {
    res.send('Welcome to VibeConnect API');
});

// Gắn các nhóm route theo module nghiệp vụ.
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);

// Middleware cuối luồng: route không tồn tại và xử lý lỗi tập trung.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
