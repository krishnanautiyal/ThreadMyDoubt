const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 1. Start Google Login
router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// 🔹 2. Google Callback
router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        // Generate JWT (same logic as your login controller)
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect to frontend with token
        res.redirect(`http://threadmydoubt.vercel.app/oauth-success?token=${token}`);
    }
);

module.exports = router;