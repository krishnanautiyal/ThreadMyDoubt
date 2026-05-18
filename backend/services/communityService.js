// services/communityService.js

const Community = require('../models/Community');

// 🔹 Get all communities
exports.getAllCommunities = async () => {
    const communities = await Community.find()
        .populate('members', 'username');

    return communities;
};

// 🔹 Get single community
exports.getCommunityBySlug = async (slug) => {
    const community = await Community.findOne({ slug })
        .populate('members', 'username');

    if (!community) {
        throw new Error('Community not found');
    }

    return community;
};

// 🔹 Create community
exports.createCommunity = async ({ body, user }) => {
    const { name, description, category, icon } = body;

    const community = await Community.create({
        name,
        description,
        category,
        icon,
        members: [user._id]
    });

    return community;
};

// 🔹 Join community
exports.joinCommunity = async ({ slug, userId }) => {
    const community = await Community.findOne({ slug });

    if (!community) {
        throw new Error('Community not found');
    }

    if (community.members.includes(userId)) {
        throw new Error('Already a member');
    }

    community.members.push(userId);
    await community.save();

    return community;
};