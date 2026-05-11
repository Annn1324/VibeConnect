const Comment = require('./comment.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const formatComment = (comment, userId) => ({
    id: comment._id,
    postID: comment.postID,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: {
        id: comment.authorID?._id || comment.authorID,
        fullname: comment.authorID?.fullname || '',
        username: comment.authorID?.username || ''
    },
    isOwner: (comment.authorID?._id || comment.authorID)?.toString() === userId
});

// Tạo bình luận mới cho một bài viết.
exports.createComment = catchAsync(async (req, res) => {
    const { postID, content } = req.body;
    const createdComment = await Comment.create({
        postID,
        authorID: req.user.userId,
        content
    });

    const comment = await Comment.findById(createdComment._id).populate('authorID', 'fullname username');

    res.status(201).json(formatComment(comment, req.user.userId));
});

// Lấy danh sách bình luận của một bài viết, có phân trang.
exports.getCommentsByPostId = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ postID: postId });
    
    // Populate authorID để client có username của người bình luận.
    const comments = await Comment.find({ postID: postId })
        .populate('authorID', 'fullname username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
        page,
        limit,
        total,
        totalPages,
        data: comments.map((comment) => formatComment(comment, req.user.userId))
    });
});

// Cập nhật bình luận. Chỉ tác giả bình luận mới được sửa.
exports.updateComment = catchAsync(async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    if (comment.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to update this comment', 403);
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate('authorID', 'fullname username');

    res.json(formatComment(updatedComment, req.user.userId));
});

// Xoá bình luận. Chỉ tác giả bình luận mới được xoá.
exports.deleteComment = catchAsync(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    if (comment.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to delete this comment', 403);
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
});
