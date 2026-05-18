const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Please add a body']
    },
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: [true, 'An answer must belong to a question']
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual 'id'
answerSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Alias for questionId
answerSchema.virtual('questionId').get(function() {
    return this.question;
});

// Alias for userId
answerSchema.virtual('userId').get(function() {
    return this.authorId;
});

// Include virtuals in JSON
answerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Answer', answerSchema);
