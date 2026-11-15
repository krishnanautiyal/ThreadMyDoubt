const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 🔹 GET /api/test/users - Returns users for testing (excludes passwords)
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error("Test users route error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🔹 GET /api/test/health - Deployment health check
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
