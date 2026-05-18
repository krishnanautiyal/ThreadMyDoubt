const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: {
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
    type: {
        type: String,
        enum: ['upvote', 'downvote'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// User can only vote once per target
voteSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
