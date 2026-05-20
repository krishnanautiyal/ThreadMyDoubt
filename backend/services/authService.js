const User = require('../models/User');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

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

    // Check MongoDB first
    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        throw new Error('User already exists');
    }

    // Save in MongoDB
    const user = await User.create({
        username,
        email,
        password
    });

    // Mirror in PostgreSQL
    try {

        await prisma.user.upsert({
            where: {
                email: user.email
            },

            update: {},

            create: {
                username: user.username,
                email: user.email,

                // Already hashed by your mongoose model
                password: user.password,

                role:
                    user.role ||
                    "Community Member",

                bio:
                    user.bio ||
                    "",

                reputation:
                    user.reputation ||
                    0,

                profilePicture:
                    user.profilePicture ||
                    "https://ui-avatars.com/api/?name=User&background=random",

                achievements: []
            }
        });

        console.log(
            "User saved to PostgreSQL:",
            user.email
        );

    } catch(error){

        console.log(
            "Prisma save failed:"
        );

        console.log(error);
    }

    const token = generateToken(
        user._id
    );

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

    const user =
        await User.findOne({
            email
        }).select('+password');

    if (!user) {
        throw new Error(
            'Invalid credentials'
        );
    }

    const isMatch =
        await user.matchPassword(
            password
        );

    if (!isMatch) {
        throw new Error(
            'Invalid credentials'
        );
    }

    const token =
        generateToken(
            user._id
        );

    return {
        user,
        token
    };
};


// Get Current User
exports.getCurrentUser =
async (userId) => {

    return await User.findById(
        userId
    );
};


// Update User Profile
exports.updateUserProfile =
async (userId, updates) => {

    const user =
        await User.findById(
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
        user.bio =
            updates.bio;
    }

    user.profilePicture =
        updates.profilePicture ||
        user.profilePicture;

    await user.save();

    return user;
};