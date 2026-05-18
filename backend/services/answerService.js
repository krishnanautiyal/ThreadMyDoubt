// services/answerService.js

const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const mongoose = require('mongoose');

// 🔹 Get answers
exports.getAnswers = async ({ questionId, authorId }) => {
    const filter = {};

    if (questionId) {
        filter.question = questionId;
    } else if (authorId) {
        filter.authorId = authorId;
    } else {
        return [];
    }

    const answers = await Answer.find(filter)
        .populate('authorId', 'username profilePicture')
        .sort({ isAccepted: -1, upvotes: -1, createdAt: 1 });

    return answers;
};

// 🔹 Create answer
exports.createAnswer = async ({ body, user }) => {
    const questionId = body.question || body.questionId;

    if (!questionId) {
        throw new Error("Question ID is required");
    }

    const question = await Question.findById(questionId);
    if (!question) {
        throw new Error("Question not found");
    }

    const answer = await Answer.create({
        ...body,
        authorId: user.id,
        question: questionId
    });

    await User.findByIdAndUpdate(user.id, {
        $inc: { answers: 1 }
    });

    await answer.populate('authorId', 'username profilePicture');

    return { answer, question };
};

exports.markBestAnswer = async ({ answerId, userId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const answer = await Answer.findById(answerId).populate('question').session(session);
        if (!answer) throw new Error("Answer not found");

        const question = answer.question;
        if (!question) throw new Error("Question not found");

        if (question.authorId.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        if (answer.isAccepted) {
            await session.commitTransaction();
            session.endSession();
            return { answer, question };
        }

        await Answer.updateMany(
            { question: question._id },
            { isAccepted: false },
            { session }
        );

        answer.isAccepted = true;
        await answer.save({ session });

        await session.commitTransaction();
        session.endSession();

        return { answer, question };

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};
// 🔹 Delete answer
exports.deleteAnswer = async ({ answerId, userId }) => {

    const answer = await Answer.findById(answerId);

    if (!answer) {
        throw new Error("Answer not found");
    }

    // owner check
    if (answer.authorId.toString() !== userId) {
        throw new Error("Not authorized");
    }

    await answer.deleteOne();

    return answer;
};