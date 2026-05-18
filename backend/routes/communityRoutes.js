const express = require('express');
const { getCommunities, getCommunity, createCommunity, joinCommunity } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getCommunities)
    .post(protect, createCommunity);

router.route('/:slug').get(getCommunity);

router.post('/:slug/join', protect, joinCommunity);

module.exports = router;
