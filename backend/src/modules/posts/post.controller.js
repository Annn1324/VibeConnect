const Post = require('./post.model');
const Comment = require('../comments/comment.model');
const Like = require('../like/like.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const cloudinary = require('../../config/cloudinary');
const uploadBufferToCloudinary = require('../../utils/cloudinaryUpload');

const toCountMap = (items) =>
    items.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
    }, {});

const formatPost = (post, { likeCounts = {}, commentCounts = {}, viewerLikes = {} } = {}) => ({
    id: post._id,
    content: post.content,
    media: post.media?.url ? {
        url: post.media.url,
        publicId: post.media.publicId,
        resourceType: post.media.resourceType,
        format: post.media.format,
        bytes: post.media.bytes,
        width: post.media.width,
        height: post.media.height,
        duration: post.media.duration
    } : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
        id: post.authorID?._id || post.authorID,
        fullname: post.authorID?.fullname || '',
        username: post.authorID?.username || ''
    },
    stats: {
        likes: likeCounts[post._id.toString()] || 0,
        comments: commentCounts[post._id.toString()] || 0
    },
    viewerLikeId: viewerLikes[post._id.toString()] || null,
    likedByMe: Boolean(viewerLikes[post._id.toString()]),
    isOwner: false
});

const formatPostWithOwner = (post, userId, stats) => {
    const formattedPost = formatPost(post, stats);

    return {
        ...formattedPost,
        isOwner: formattedPost.author.id?.toString() === userId
    };
};

const loadPostStats = async (postIds, userId) => {
    if (!postIds.length) {
        return {
            likeCounts: {},
            commentCounts: {},
            viewerLikes: {}
        };
    }

    const [likeCountsRaw, commentCountsRaw, viewerLikesRaw] = await Promise.all([
        Like.aggregate([
            { $match: { postID: { $in: postIds } } },
            { $group: { _id: '$postID', count: { $sum: 1 } } }
        ]),
        Comment.aggregate([
            { $match: { postID: { $in: postIds } } },
            { $group: { _id: '$postID', count: { $sum: 1 } } }
        ]),
        Like.find({
            postID: { $in: postIds },
            authorID: userId
        }).select('_id postID')
    ]);

    return {
        likeCounts: toCountMap(likeCountsRaw),
        commentCounts: toCountMap(commentCountsRaw),
        viewerLikes: viewerLikesRaw.reduce((acc, like) => {
            acc[like.postID.toString()] = like._id.toString();
            return acc;
        }, {})
    };
};

// Create a new post
exports.createPost = catchAsync(async (req, res) => {
    const { content } = req.body;
    let media;

    if (req.file) {
        const uploadedMedia = await uploadBufferToCloudinary(
            req.file,
            process.env.CLOUDINARY_POST_FOLDER || 'vibeconnect/posts'
        );

        media = {
            url: uploadedMedia.secure_url,
            publicId: uploadedMedia.public_id,
            resourceType: uploadedMedia.resource_type,
            format: uploadedMedia.format,
            bytes: uploadedMedia.bytes,
            width: uploadedMedia.width,
            height: uploadedMedia.height,
            duration: uploadedMedia.duration
        };
    }

    const createdPost = await Post.create({
        authorID: req.user.userId,
        content,
        media
    });

    const post = await Post.findById(createdPost._id).populate('authorID', 'fullname username');

    res.status(201).json(
        formatPostWithOwner(post, req.user.userId, {
            likeCounts: {},
            commentCounts: {},
            viewerLikes: {}
        })
    );
});

// Get all posts
exports.getPosts = catchAsync(async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const [total, posts] = await Promise.all([
        Post.countDocuments(),
        Post.find()
            .populate('authorID', 'fullname username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
    ]);

    const stats = await loadPostStats(
        posts.map((post) => post._id),
        req.user.userId
    );

    const totalPages = Math.ceil(total / limit);

    res.json({
        page,
        limit,
        total,
        totalPages,
        data: posts.map((post) => formatPostWithOwner(post, req.user.userId, stats))
    });
});


// Get a single post by ID
exports.getPostById = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('authorID', 'fullname username');

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    const stats = await loadPostStats([post._id], req.user.userId);

    res.json(formatPostWithOwner(post, req.user.userId, stats));
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

    const updatedPost = await Post.findById(post._id).populate('authorID', 'fullname username');
    const stats = await loadPostStats([post._id], req.user.userId);

    res.json(formatPostWithOwner(updatedPost, req.user.userId, stats));
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

    if (post.media?.publicId) {
        try {
            await cloudinary.uploader.destroy(post.media.publicId, {
                resource_type: post.media.resourceType || 'image'
            });
        } catch (error) {
            console.warn('Could not delete Cloudinary media', error.message);
        }
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
});
