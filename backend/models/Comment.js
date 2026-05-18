const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Please add a comment body'],
        trim: true
    },
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['Question', 'Answer']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
