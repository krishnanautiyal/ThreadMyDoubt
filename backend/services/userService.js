// services/userService.js

const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/activity.log');

// 🔹 Get all users
exports.getAllUsers = async () => {
    return await User.find();
};

// 🔹 Get single user
exports.getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
};

// 🔹 Update user
exports.updateUser = async ({ userId, currentUser, updates }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.id !== currentUser.id && currentUser.role !== 'Admin') {
        throw new Error('Not authorized');
    }

    return await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
    });
};

// 🔹 Delete user
exports.deleteUser = async ({ userId, currentUser }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.id !== currentUser.id && currentUser.role !== 'Admin') {
        throw new Error('Not authorized');
    }

    await user.deleteOne();
    return true;
};

// 🔹 Get user questions
exports.getUserQuestions = async (userId) => {
    return await Question.find({ authorId: userId });
};

// 🔹 Get user answers
exports.getUserAnswers = async (userId) => {
    return await Answer.find({ authorId: userId })
        .populate('question', 'title');
};

// 🔹 Get user activity (logs)
exports.getUserActivity = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!fs.existsSync(logFilePath)) return [];

    const data = fs.readFileSync(logFilePath, 'utf8');

    return data
        .trim()
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(log => log && log.username === user.username)
        .reverse();
};

// 🔹 Dashboard stats
exports.getDashboardStats = async (userId) => {
    const questions = await Question.countDocuments({ authorId: userId });
    const answers = await Answer.countDocuments({ authorId: userId });

    const userAnswers = await Answer.find({ authorId: userId });

    const upvotes = userAnswers.reduce(
        (total, answer) => total + (answer.upvotes || 0),
        0
    );

    const reputation = (answers * 5) + (upvotes);

    return {
        questions,
        answers,
        upvotes,
        reputation
    };
};