// services/authService.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 🔹 Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// 🔹 Register
exports.registerUser = async ({ username, email, password }) => {
    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        username,
        email,
        password
    });

    const token = generateToken(user._id);

    return { user, token };
};

// 🔹 Login
exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);

    return { user, token };
};

// 🔹 Get current user
exports.getCurrentUser = async (userId) => {
    const user = await User.findById(userId);
    return user;
};

// 🔹 Update profile
exports.updateUserProfile = async (userId, updates) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.username = updates.username || user.username;
    user.role = updates.role || user.role;

    if (updates.bio !== undefined) {
        user.bio = updates.bio;
    }

    user.profilePicture = updates.profilePicture || user.profilePicture;

    await user.save();

    return user;
};