const User = require('../models/User');
const { logEvent } = require('./logger');

/**
 * Handle unlocking an achievement for a user
 * @param {string} userId - The user's ID
 * @param {string} achievementId - The achievement identifier (match frontend IDs)
 * @returns {Promise<boolean>} - True if newly unlocked, false if already present
 */
const unlockAchievement = async (userId, achievementId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return false;

        // Check if achievement already unlocked
        if (user.achievements.includes(achievementId)) {
            return false;
        }

        // Add to achievements set
        await User.findByIdAndUpdate(userId, {
            $addToSet: { achievements: achievementId }
        });

        console.log(`Achievement unlocked: ${achievementId} for user ${userId}`);

        logEvent({
            event: 'ACHIEVEMENT_UNLOCKED',
            username: user.username,
            title: achievementId.replace('achievement_', '').replace(/([A-Z])/g, ' $1').trim(),
            time: new Date()
        });

        return true;
    } catch (err) {
        console.error('Error unlocking achievement:', err);
        return false;
    }
};

module.exports = { unlockAchievement };
