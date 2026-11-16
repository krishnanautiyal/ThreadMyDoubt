const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 1. Start Google Login
router.get("/google", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(503).json({
            success: false,
            error: "Google OAuth is not configured on this server"
        });
    }
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })(req, res, next);
});

// 🔹 2. Google Callback
router.get("/google/callback",
    (req, res, next) => {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return res.status(503).json({
                success: false,
                error: "Google OAuth is not configured on this server"
            });
        }
        passport.authenticate("google", { session: false })(req, res, next);
    },
    (req, res) => {
        // Generate JWT (same logic as login controller)
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect to frontend with token
        const frontendUrl = process.env.CLIENT_URL || "https://thread-my-doubt.vercel.app";
        res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
    }
);

module.exports = router;
