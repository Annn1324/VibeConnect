const Post = require('./post.model');
const Comment = require('../comments/comment.model');
const Like = require('../like/like.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const cloudinary = require('../../config/cloudinary');
const uploadBufferToCloudinary = require('../../utils/cloudinaryUpload');

// Chuyển kết quả aggregate từ MongoDB thành object tra cứu nhanh theo postId.
const toCountMap = (items) =>
    items.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
    }, {});

// Chuẩn hoá dữ liệu post trước khi trả về client để frontend không phụ thuộc trực tiếp vào schema MongoDB.
const formatPost = (post, { likeCounts = {}, commentCounts = {}, viewerLikes = {} } = {}) => ({
    id: post._id,
    content: post.content,
    media: Array.isArray(post.media) ? post.media : (post.media?.url ? [post.media] : []),
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

// Gắn thêm quyền sở hữu bài viết theo user hiện tại.
const formatPostWithOwner = (post, userId, stats) => {
    const formattedPost = formatPost(post, stats);

    return {
        ...formattedPost,
        isOwner: formattedPost.author.id?.toString() === userId
    };
};

// Tải thống kê like/comment và trạng thái like của viewer trong một lần để tránh query lặp từng post.
const loadPostStats = async (postIds, userId) => {
    if (!postIds.length) {
        return {
            likeCounts: {},
            commentCounts: {},
            viewerLikes: {}
        };
    }

    // Chạy song song các truy vấn độc lập để giảm thời gian phản hồi API.
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

// Tạo bài viết mới, kèm upload media nếu request có file.
exports.createPost = catchAsync(async (req, res) => {
    const { content } = req.body;
    let media;

    if (req.files?.length) {
        // map tạo danh sách Promise upload, Promise.all đợi tất cả file upload xong rồi mới lưu post.
        const uploadedMediaItems = await Promise.all(
            req.files.map((file) =>
                uploadBufferToCloudinary(
                    file,
                    process.env.CLOUDINARY_POST_FOLDER || 'vibeconnect/posts'
                )
            )
        );

        // Chỉ lưu metadata cần dùng ở client và lúc xoá file trên Cloudinary.
        media = uploadedMediaItems.map((uploadedMedia) => ({
            url: uploadedMedia.secure_url,
            publicId: uploadedMedia.public_id,
            resourceType: uploadedMedia.resource_type,
            format: uploadedMedia.format,
            bytes: uploadedMedia.bytes,
            width: uploadedMedia.width,
            height: uploadedMedia.height,
            duration: uploadedMedia.duration
        }));
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

// Lấy danh sách bài viết có phân trang và thống kê tương tác.
exports.getPosts = catchAsync(async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    // Tổng số bài và danh sách bài là hai truy vấn độc lập nên có thể chạy song song.
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


// Lấy chi tiết một bài viết theo ID.
exports.getMyPosts = catchAsync(async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const filter = { authorID: req.user.userId };

    const [total, posts] = await Promise.all([
        Post.countDocuments(filter),
        Post.find(filter)
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

exports.getPostById = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('authorID', 'fullname username');

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    const stats = await loadPostStats([post._id], req.user.userId);

    res.json(formatPostWithOwner(post, req.user.userId, stats));
});

// Cập nhật nội dung bài viết. Chỉ chủ bài viết mới được sửa.
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

// Xoá bài viết và dọn media tương ứng trên Cloudinary. Chỉ chủ bài viết mới được xoá.
exports.deletePost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorID.toString() !== req.user.userId) {
        throw new AppError('You are not allowed to delete this post', 403);
    }

    const mediaItems = Array.isArray(post.media) ? post.media : (post.media?.publicId ? [post.media] : []);

    if (mediaItems.length) {
        // Không chặn xoá post nếu Cloudinary xoá file thất bại; log lại để kiểm tra sau.
        await Promise.all(mediaItems.map(async (mediaItem) => {
            if (!mediaItem.publicId) {
                return;
            }

            try {
                await cloudinary.uploader.destroy(mediaItem.publicId, {
                    resource_type: mediaItem.resourceType || 'image'
                });
            } catch (error) {
                console.warn('Could not delete Cloudinary media', error.message);
            }
        }));
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
});
