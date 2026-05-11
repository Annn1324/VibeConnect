const Like = require('./like.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// Tạo like cho bài viết và phát sự kiện realtime để client cập nhật số like.
exports.createLike = catchAsync(async (req, res) => {
    const { postID } = req.body;
    const existingLike = await Like.findOne({
        postID,
        authorID: req.user.userId
    });

    if (existingLike) {
        return res.status(200).json(existingLike);
    }

    const like = await Like.create({
        postID,
        authorID: req.user.userId
    });

    req.app.get('io')?.emit('post:like-changed', {
        postId: postID,
        delta: 1,
        actorId: req.user.userId,
        likeId: like._id
    });

    res.status(201).json(like);
});

// Xoá like theo ID. Chỉ user đã tạo like mới được xoá like đó.
exports.deleteLike = catchAsync(async (req, res) => {
    const like = await Like.findById(req.params.id);

    if (!like) {
        throw new AppError('Like not found', 404);
    }

    if (like.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to remove this like', 403);
    }

    await like.deleteOne();
    req.app.get('io')?.emit('post:like-changed', {
        postId: like.postID.toString(),
        delta: -1,
        actorId: req.user.userId,
        likeId: like._id
    });

    res.json({ message: 'Like removed' });
});

// Lấy danh sách người đã like một bài viết.
exports.getLikesByPostId = catchAsync(async (req, res) => {
    const likes = await Like.find({ postID: req.params.postId }).populate('authorID', 'username');
    res.json(likes);
});
