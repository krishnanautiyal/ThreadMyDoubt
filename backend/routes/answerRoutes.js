const express = require('express');

const {
    getAnswers,
    createAnswer,
    markBestAnswer,
    deleteAnswer
} = require('../controllers/answerController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getAnswers)
    .post(protect, createAnswer);

router.route('/:questionId')
    .get(getAnswers);

router.put('/:id/accept', protect, markBestAnswer);

router.delete('/:id', protect, deleteAnswer);

module.exports = router;