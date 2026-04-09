const Like = require('./like.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

exports.createLike = catchAsync(async (req, res) => {
    const { postID } = req.body;
    const like = await Like.create({
        postID,
        authorID: req.user.userId
    });

    res.status(201).json(like);
});

exports.deleteLike = catchAsync(async (req, res) => {
    const like = await Like.findById(req.params.id);

    if (!like) {
        throw new AppError('Like not found', 404);
    }

    if (like.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to remove this like', 403);
    }

    await like.deleteOne();
    res.json({ message: 'Like removed' });
});

exports.getLikesByPostId = catchAsync(async (req, res) => {
    const likes = await Like.find({ postID: req.params.postId }).populate('authorID', 'username');
    res.json(likes);
});
