const express = require('express');

const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByTag,
    searchQuestions
} = require('../controllers/questionController');

const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/search', searchQuestions);

router.get('/tag/:tagName', getQuestionsByTag);

router.route('/')
    .get(getQuestions)
    .post(
        protect,
        upload.single('image'),
        createQuestion
    );

router.route('/:id')
    .get(getQuestion)
    .put(protect, updateQuestion)
    .delete(protect, deleteQuestion);

module.exports = router;