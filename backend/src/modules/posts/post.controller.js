const Post = require('./post.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// Create a new post
exports.createPost = catchAsync(async (req, res) => {
    const { content } = req.body;
    const post = await Post.create({
        authorID: req.user.userId,
        content
    });

    res.status(201).json(post);
});

// Get all posts
exports.getPosts = catchAsync(async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();

    const posts = await Post.find()
        .populate('authorID', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
        page,
        limit,
        total,
        totalPages,
        data: posts
    });
});


// Get a single post by ID
exports.getPostById = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('authorID', 'username');

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    res.json(post);
});

// Update a post
exports.updatePost = catchAsync(async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to update this post', 403);
    }

    post.content = content;
    await post.save();

    res.json(post);
});

// Delete a post
exports.deletePost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to delete this post', 403);
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
});
