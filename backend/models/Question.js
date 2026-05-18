const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [150, 'Title can not be more than 150 characters']
    },
    body: {
        type: String,
        required: [true, 'Please add a body']
    },
    image: {
    type: String,
    default: null
},
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    communityId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Community',
        required: true
    },

     bestAnswerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Answer',
        default: null
    },
    tags: {
        type: [String],
        default: []
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    answers: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual 'id'
questionSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Alias for userId
questionSchema.virtual('userId').get(function() {
    return this.authorId;
});

// Include virtuals in JSON
questionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);
