// services/questionService.js

const Question = require('../models/Question');
const Community = require('../models/Community');
const Answer = require('../models/Answer');
const User = require('../models/User');

// 🔹 Get all questions
exports.getQuestions = async (queryParams) => {
    const reqQuery = { ...queryParams };

    const removeFields = ['sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let query = Question.find(reqQuery)
        .populate('authorId', 'username profilePicture')
        .populate('communityId', 'name icon');

    if (queryParams.sort) {
        const sortBy = queryParams.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    return await query;
};

// 🔹 Get single question + answers
exports.getQuestionById = async (id) => {
    const question = await Question.findById(id)
        .populate('authorId', 'username profilePicture')
        .populate('communityId', 'name icon');

    if (!question) throw new Error('Question not found');

    const answers = await Answer.find({ question: question._id })
        .populate('authorId', 'username profilePicture');

    return {
        ...question._doc,
        answers
    };
};

// 🔹 Create question
exports.createQuestion = async ({ body, user }) => {
    const community = await Community.findById(body.communityId);
    if (!community) throw new Error('Community not found');

    const question = await Question.create({
        ...body,
        authorId: user.id
    });

    await User.findByIdAndUpdate(user.id, {
        $inc: { questions: 1 }
    });

    await question.populate('authorId', 'username profilePicture');
    await question.populate('communityId', 'name icon');

    return question;
};

// 🔹 Update question
exports.updateQuestion = async ({ questionId, userId, updates }) => {
    let question = await Question.findById(questionId);

    if (!question) throw new Error('Question not found');

    if (question.authorId.toString() !== userId) {
        throw new Error('Not authorized');
    }

    question = await Question.findByIdAndUpdate(
        questionId,
        updates,
        { new: true, runValidators: true }
    );

    return question;
};

// 🔹 Delete question
exports.deleteQuestion = async ({ questionId, userId }) => {

    const question = await Question.findById(questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    // owner check
    if (question.authorId.toString() !== userId) {
        throw new Error('Not authorized');
    }

    // delete all answers related to this question
    await Answer.deleteMany({
        question: question._id
    });

    // delete question
    await question.deleteOne();

    const io = req.app.get("io");

io.emit("questionDeleted", {
    questionId: question._id
});

    return question;
};

// 🔹 Get by tag
exports.getQuestionsByTag = async (tagName) => {
    return await Question.find({ tags: tagName })
        .populate('authorId', 'username profilePicture')
        .populate('communityId', 'name icon');
};

// 🔹 Search
exports.searchQuestions = async (keyword) => {
    return await Question.find({
        $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { body: { $regex: keyword, $options: 'i' } }
        ]
    })
    .populate('authorId', 'username profilePicture')
    .populate('communityId', 'name icon');
};