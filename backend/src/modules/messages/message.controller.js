const mongoose = require('mongoose');
const Message = require('./message.model');
const User = require('../users/user.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const formatUser = (user) => ({
    id: user._id,
    fullname: user.fullname,
    username: user.username,
    email: user.email
});

const formatMessage = (message, viewerId) => ({
    id: message._id,
    content: message.content,
    createdAt: message.createdAt,
    readAt: message.readAt,
    sender: formatUser(message.senderID),
    receiver: formatUser(message.receiverID),
    fromMe: message.senderID._id.toString() === viewerId
});

exports.getConversationUsers = catchAsync(async (req, res) => {
    const viewerId = req.user.userId;
    const users = await User.find({ _id: { $ne: viewerId } })
        .select('fullname username email createdAt')
        .sort({ fullname: 1, username: 1 });

    const viewerObjectId = toObjectId(viewerId);
    const lastMessages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderID: viewerObjectId },
                    { receiverID: viewerObjectId }
                ]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $addFields: {
                peerID: {
                    $cond: [
                        { $eq: ['$senderID', viewerObjectId] },
                        '$receiverID',
                        '$senderID'
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$peerID',
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$receiverID', viewerObjectId] },
                                    { $eq: ['$readAt', null] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const lastMessageMap = lastMessages.reduce((acc, item) => {
        acc[item._id.toString()] = item;
        return acc;
    }, {});

    res.json({
        data: users.map((user) => {
            const messageMeta = lastMessageMap[user._id.toString()];
            return {
                user: formatUser(user),
                lastMessage: messageMeta?.lastMessage
                    ? {
                        id: messageMeta.lastMessage._id,
                        content: messageMeta.lastMessage.content,
                        createdAt: messageMeta.lastMessage.createdAt,
                        fromMe: messageMeta.lastMessage.senderID.toString() === viewerId
                    }
                    : null,
                unreadCount: messageMeta?.unreadCount || 0
            };
        })
    });
});

exports.getConversationMessages = catchAsync(async (req, res) => {
    const viewerId = req.user.userId;
    const peerId = req.params.userId;

    if (viewerId === peerId) {
        throw new AppError('You cannot open a conversation with yourself', 400);
    }

    const peer = await User.findById(peerId).select('fullname username email createdAt');

    if (!peer) {
        throw new AppError('User not found', 404);
    }

    await Message.updateMany(
        { senderID: peerId, receiverID: viewerId, readAt: null },
        { readAt: new Date() }
    );

    const messages = await Message.find({
        $or: [
            { senderID: viewerId, receiverID: peerId },
            { senderID: peerId, receiverID: viewerId }
        ]
    })
        .populate('senderID', 'fullname username email')
        .populate('receiverID', 'fullname username email')
        .sort({ createdAt: 1 });

    res.json({
        peer: formatUser(peer),
        data: messages.map((message) => formatMessage(message, viewerId))
    });
});

exports.createMessage = catchAsync(async (req, res) => {
    const viewerId = req.user.userId;
    const peerId = req.params.userId;

    if (viewerId === peerId) {
        throw new AppError('You cannot send a message to yourself', 400);
    }

    const peer = await User.findById(peerId).select('_id');

    if (!peer) {
        throw new AppError('User not found', 404);
    }

    const createdMessage = await Message.create({
        senderID: viewerId,
        receiverID: peerId,
        content: req.body.content
    });

    const message = await Message.findById(createdMessage._id)
        .populate('senderID', 'fullname username email')
        .populate('receiverID', 'fullname username email');

    res.status(201).json(formatMessage(message, viewerId));
});
