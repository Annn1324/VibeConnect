const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Database connection
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const authRoutes = require('./modules/auth/auth.route');
const postRoutes = require('./modules/posts/post.route');
const commentRoutes = require('./modules/comments/comment.route');
const likeRoutes = require('./modules/like/like.route');

// Load environment variables and connect to database
dotenv.config();
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());


// Test route
app.get('/', (req, res) => {
    res.send('Welcome to VibeConnect API');
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
