// controllers/userController.js

const userService = require('../services/userService');

// 🔹 Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Get single user
exports.getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};

// 🔹 Update user
exports.updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser({
            userId: req.params.userId,
            currentUser: req.user,
            updates: req.body
        });

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Delete user
exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser({
            userId: req.params.userId,
            currentUser: req.user
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Get user questions
exports.getUserQuestions = async (req, res) => {
    try {
        const questions = await userService.getUserQuestions(req.params.userId);

        res.status(200).json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Get user answers
exports.getUserAnswers = async (req, res) => {
    try {
        const answers = await userService.getUserAnswers(req.params.userId);

        res.status(200).json({ success: true, data: answers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Get activity
exports.getUserActivity = async (req, res) => {
    try {
        const logs = await userService.getUserActivity(req.params.userId);

        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};

// 🔹 Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const stats = await userService.getDashboardStats(req.user.id);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};