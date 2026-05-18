const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // 1. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Place log here

        // 2. Find user (Fix: Define 'user' variable)
        const user = await User.findById(decoded.id);
        console.log("User found:", user); // Place log here

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            });
        }

        // 3. Attach user to request object
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

module.exports = { protect };
