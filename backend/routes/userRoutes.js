const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserQuestions,
    getUserAnswers,
    getUserActivity,
    getDashboard
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:userId', getUser);
router.put('/:userId', protect, updateUser);
router.delete('/:userId', protect, deleteUser);

router.get('/:userId/questions', getUserQuestions);
router.get('/:userId/answers', getUserAnswers);
router.get('/:userId/activity', protect, getUserActivity);

module.exports = router;
