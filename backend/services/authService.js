const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Register User
exports.registerUser = async ({
    username,
    email,
    password
}) => {

    // Check if user already exists
    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        throw new Error('User already exists');
    }

    // Save user in MongoDB
    const user = await User.create({
        username,
        email,
        password
    });

    const token = generateToken(user._id);

    return {
        user,
        token
    };
};


// Login User
exports.loginUser = async ({
    email,
    password
}) => {

    if (!email || !password) {
        throw new Error(
            'Please provide email and password'
        );
    }

    // Find user and include password
    const user = await User
        .findOne({ email })
        .select('+password');

    if (!user) {
        throw new Error(
            'Invalid credentials'
        );
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error(
            'Invalid credentials'
        );
    }

    const token = generateToken(
        user._id
    );

    return {
        user,
        token
    };
};


// Get Current User
exports.getCurrentUser = async (userId) => {
    return await User.findById(userId);
};


// Update User Profile
exports.updateUserProfile = async (
    userId,
    updates
) => {

    const user = await User.findById(
        userId
    );

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    user.username =
        updates.username ||
        user.username;

    user.role =
        updates.role ||
        user.role;

    if (
        updates.bio !== undefined
    ) {
        user.bio = updates.bio;
    }

    user.profilePicture =
        updates.profilePicture ||
        user.profilePicture;

    await user.save();

    return user;
};