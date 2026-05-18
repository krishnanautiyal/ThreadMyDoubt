// controllers/authController.js

const authService = require('../services/authService');
const { logEvent } = require('../utils/logger');

// 🔹 Register
exports.register = async (req, res) => {
    try {
        const { user, token } = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,
                bio: user.bio,
                reputation: user.reputation
            }
        });

        logEvent({
            event: 'USER_SIGNUP',
            username: user.username,
            time: new Date()
        });

    } catch (err) {
        logEvent({
            event: 'SERVER_ERROR',
            username: 'System',
            title: `Signup failed: ${err.message}`,
            time: new Date()
        });

        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Login
exports.login = async (req, res) => {
    try {
        const { user, token } = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,
                bio: user.bio,
                reputation: user.reputation
            }
        });

        logEvent({
            event: 'USER_LOGIN',
            username: user.username,
            time: new Date()
        });

    } catch (err) {
        logEvent({
            event: 'SERVER_ERROR',
            username: 'System',
            title: `Login failed: ${err.message}`,
            time: new Date()
        });

        res.status(401).json({ success: false, error: err.message });
    }
};

// 🔹 Get Me
exports.getMe = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await authService.updateUserProfile(
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,
                bio: user.bio,
                reputation: user.reputation
            }
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Logout
exports.logout = async (req, res) => {
    logEvent({
        event: 'USER_LOGOUT',
        username: req.user.username,
        time: new Date()
    });

    res.status(200).json({
        success: true,
        data: 'User logged out'
    });
};