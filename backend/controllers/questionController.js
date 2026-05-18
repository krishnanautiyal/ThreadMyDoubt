// controllers/questionController.js

const questionService = require('../services/questionService');
const { logEvent } = require('../utils/logger');
const { unlockAchievement } = require('../utils/achievementService');

// 🔹 Get all questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await questionService.getQuestions(req.query);

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Get single question
exports.getQuestion = async (req, res) => {
    try {
        const data = await questionService.getQuestionById(req.params.id);

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};

// 🔹 Create question
exports.createQuestion = async (req, res) => {
    try {
        const question = await questionService.createQuestion({
    body: {
        ...req.body,
        image: req.file ? req.file.path : null
    },
    user: req.user
});

        res.status(201).json({
            success: true,
            data: question
        });

        const io = req.app.get("io");

io.emit("newQuestion", question);

console.log("NEW QUESTION EMITTED");

        await unlockAchievement(req.user.id, 'achievement_firstQuestion');

        logEvent({
            event: 'POST_CREATION',
            username: req.user.username,
            title: question.title,
            time: new Date()
        });

    } catch (err) {
        logEvent({
            event: 'SERVER_ERROR',
            username: req.user ? req.user.username : 'System',
            title: `Question creation failed: ${err.message}`,
            time: new Date()
        });

        res.status(400).json({ success: false, error: err.message });


    }
};

// 🔹 Update
exports.updateQuestion = async (req, res) => {
    try {
        const question = await questionService.updateQuestion({
            questionId: req.params.id,
            userId: req.user.id,
            updates: req.body
        });

        res.status(200).json({
            success: true,
            data: question
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Delete
exports.deleteQuestion = async (req, res) => {

    try {

        const question = await questionService.deleteQuestion({
            questionId: req.params.id,
            userId: req.user.id
        });

        res.status(200).json({
            success: true,
            data: {}
        });

        const io = req.app.get("io");

io.emit("questionDeleted", {
    questionId: question._id
});

console.log("QUESTION DELETE EMITTED");

        logEvent({
            event: 'POST_DELETION',
            username: req.user.username,
            title: question.title,
            time: new Date()
        });

    } catch (err) {

        console.log(err);

        res.status(400).json({
            success: false,
            error: err.message
        });

    }
};
// 🔹 Get by tag
exports.getQuestionsByTag = async (req, res) => {
    try {
        const questions = await questionService.getQuestionsByTag(req.params.tagName);

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Search
exports.searchQuestions = async (req, res) => {
    try {
        const questions = await questionService.searchQuestions(req.query.q);

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};