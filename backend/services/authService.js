const User = require('../models/User');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// 🔹 Generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// 🔹 Register
exports.registerUser = async ({
    username,
    email,
    password
}) => {

    // Mongo check
    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        throw new Error('User already exists');
    }

    // Save to Mongo
    const user = await User.create({
        username,
        email,
        password
    });

    try {

        // Save same user to PostgreSQL
        await prisma.user.create({
            data: {
                username,
                email,
                password: user.password, // already hashed by Mongoose
                role: user.role,
                bio: user.bio,
                reputation: user.reputation,
                profilePicture: user.profilePicture
            }
        });

    } catch(error) {

        console.log(
            "Prisma save failed:",
            error.message
        );
    }

    const token = generateToken(user._id);

    return { user, token };
};


// 🔹 Login
exports.loginUser = async ({
    email,
    password
}) => {

    if(!email || !password){
        throw new Error(
            'Please provide email and password'
        );
    }

    const user =
        await User.findOne({
            email
        }).select('+password');

    if(!user){
        throw new Error(
            'Invalid credentials'
        );
    }

    const isMatch =
        await user.matchPassword(
            password
        );

    if(!isMatch){
        throw new Error(
            'Invalid credentials'
        );
    }

    const token =
        generateToken(
            user._id
        );

    return { user, token };
};


// 🔹 Get current user
exports.getCurrentUser = async (userId)=>{

    return await User.findById(
        userId
    );
};


// 🔹 Update profile
exports.updateUserProfile =
async(userId,updates)=>{

    const user =
        await User.findById(
            userId
        );

    if(!user){
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

    if(updates.bio !== undefined){
        user.bio =
            updates.bio;
    }

    user.profilePicture =
        updates.profilePicture ||
        user.profilePicture;

    await user.save();

    return user;
};


const User = require("../models/User");
const prisma = require("../config/prisma");

exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        // Mongo save (your existing code)
        const user = await User.create({
            username,
            email,
            password
        });

        // PostgreSQL mirror
        await prisma.user.upsert({
            where: {
                email: user.email
            },
            update: {},
            create: {
                username: user.username,
                email: user.email,
                password: user.password,
                achievements: []
            }
        });

        res.status(201).json({
            success: true,
            user
        });

    } catch(error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};