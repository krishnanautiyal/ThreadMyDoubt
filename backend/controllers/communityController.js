// controllers/communityController.js

const communityService = require('../services/communityService');
const { unlockAchievement } = require('../utils/achievementService');

// 🔹 Get all communities
exports.getCommunities = async (req, res) => {
    try {
        const communities = await communityService.getAllCommunities();

        res.status(200).json({
            success: true,
            count: communities.length,
            data: communities
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 Get single community
exports.getCommunity = async (req, res) => {
    try {
        const community = await communityService.getCommunityBySlug(req.params.slug);

        res.status(200).json({
            success: true,
            data: community
        });

    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};

// 🔹 Create community
exports.createCommunity = async (req, res) => {
    try {
        const community = await communityService.createCommunity({
            body: req.body,
            user: req.user
        });

        res.status(201).json({
            success: true,
            data: community
        });

        // 🔥 Side effect stays in controller
        await unlockAchievement(req.user.id, 'achievement_communityBuilder');

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 🔹 Join community
exports.joinCommunity = async (req, res) => {
    try {
        const community = await communityService.joinCommunityBySlug({
            slug: req.params.slug,
            userId: req.user.id
        });

        res.status(200).json({
            success: true,
            data: community
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};