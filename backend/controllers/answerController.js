// controllers/answerController.js

const answerService = require('../services/answerService');
const { logEvent } = require('../utils/logger');
const { unlockAchievement } = require('../utils/achievementService');

// 🔹 Get answers
exports.getAnswers = async (req, res) => {
    try {
        const answers = await answerService.getAnswers({
            questionId: req.params.questionId || req.query.questionId,
            authorId: req.query.authorId
        });

        res.status(200).json({
            success: true,
            count: answers.length,
            data: answers
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Create answer
exports.createAnswer = async (req, res) => {
    try {
        const { answer, question } = await answerService.createAnswer({
            body: req.body,
            user: req.user
        });

        res.status(201).json({ success: true, data: answer });

        // 🔥 Socket event
        const io = req.app.get("io");
        io.to(question._id.toString()).emit("newAnswer", {
            questionId: question._id.toString(),
            answer
        });

        // 🔥 Achievement
        await unlockAchievement(req.user.id, 'achievement_firstAnswer');

        // 🔥 Logging
        logEvent({
            event: 'ANSWER_CREATION',
            username: req.user.username,
            title: question.title,
            time: new Date()
        });

    } catch (err) {
        logEvent({
            event: 'SERVER_ERROR',
            username: req.user ? req.user.username : 'System',
            title: `Answer creation failed: ${err.message}`,
            time: new Date()
        });

        res.status(400).json({ success: false, error: err.message });
    }
};

exports.markBestAnswer = async (req, res) => {
    try {
        const { answer, question } = await answerService.markBestAnswer({
            answerId: req.params.id, // ✅ fixed
            userId: req.user.id
        });

        const io = req.app.get("io");

        io.to(question._id.toString()).emit("bestAnswerUpdated", {
            questionId: question._id.toString(),
            answerId: answer._id.toString()
        });

        logEvent({
            event: 'BEST_ANSWER_MARKED',
            username: req.user.username,
            title: question.title,
            time: new Date()
        });

        res.status(200).json({
            success: true,
            data: answer
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// 🔹 Delete answer
exports.deleteAnswer = async (req, res) => {

    try {

        await answerService.deleteAnswer({
            answerId: req.params.id,
            userId: req.user.id
        });

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            error: err.message
        });

    }
};