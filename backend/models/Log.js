const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', logSchema);
