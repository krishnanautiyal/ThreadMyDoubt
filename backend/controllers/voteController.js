// controllers/voteController.js

const voteService = require('../services/voteService');
const { logEvent } = require('../utils/logger');
const { unlockAchievement } = require('../utils/achievementService');

exports.castVote = async (req, res) => {
    try {
        const { targetId, targetModel, type } = req.body;

        const result = await voteService.castVote({
            targetId,
            targetModel,
            type,
            userId: req.user.id
        });

        // 🔥 Handle response based on result
        if (result.status === 'removed') {
            return res.status(200).json({
                success: true,
                message: 'Vote removed',
                upvotes: result.upvotes
            });
        }

        if (result.status === 'changed') {
            return res.status(200).json({
                success: true,
                message: 'Vote changed',
                upvotes: result.upvotes
            });
        }

        // 🔥 New vote side effects
        if (result.status === 'created') {

            if (targetModel === 'Answer' && result.target.upvotes >= 10) {
                await unlockAchievement(
                    result.target.authorId,
                    'achievement_popularAnswer'
                );
            }

            logEvent({
                event: 'VOTE_CAST',
                username: req.user.username,
                title: targetModel === 'Question'
                    ? result.target.title
                    : 'an answer',
                time: new Date()
            });

            return res.status(201).json({
                success: true,
                message: 'Vote recorded',
                upvotes: result.upvotes
            });
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};