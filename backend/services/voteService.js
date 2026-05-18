// services/voteService.js

const Vote = require('../models/Vote');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

exports.castVote = async ({ targetId, targetModel, type, userId }) => {

    // 🔹 Validate inputs
    if (!['Question', 'Answer'].includes(targetModel)) {
        throw new Error('Invalid target model');
    }

    if (!['upvote', 'downvote'].includes(type)) {
        throw new Error('Invalid vote type');
    }

    const Model = targetModel === 'Question' ? Question : Answer;
    const target = await Model.findById(targetId);

    if (!target) {
        throw new Error(`${targetModel} not found`);
    }

    const existingVote = await Vote.findOne({ userId, targetId, targetModel });

    // 🔥 CASE 1: Existing vote
    if (existingVote) {

        // 🔸 Same vote → remove
        if (existingVote.type === type) {
            await existingVote.deleteOne();

            target.upvotes += (type === 'upvote' ? -1 : 1);
            await target.save();

            if (targetModel === 'Answer' && type === 'upvote') {
                await User.findByIdAndUpdate(target.authorId, {
                    $inc: { upvotes: -1 }
                });
            }

            return {
                status: 'removed',
                upvotes: target.upvotes,
                target
            };
        }

        // 🔸 Change vote
        existingVote.type = type;
        await existingVote.save();

        const change = type === 'upvote' ? 2 : -2;
        target.upvotes += change;
        await target.save();

        if (targetModel === 'Answer') {
            await User.findByIdAndUpdate(target.authorId, {
                $inc: { upvotes: change }
            });
        }

        return {
            status: 'changed',
            upvotes: target.upvotes,
            target
        };
    }

    // 🔥 CASE 2: New vote
    await Vote.create({ userId, targetId, targetModel, type });

    const change = type === 'upvote' ? 1 : -1;
    target.upvotes += change;
    await target.save();

    if (targetModel === 'Answer' && type === 'upvote') {
        await User.findByIdAndUpdate(target.authorId, {
            $inc: { upvotes: 1 }
        });
    }

    return {
        status: 'created',
        upvotes: target.upvotes,
        target
    };
};