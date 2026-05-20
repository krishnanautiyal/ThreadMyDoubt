const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    
    password: {
    type: String,
    required: function () {
        return this.authProvider === 'local';
    },
    minlength: 6,
    select: false
}
    ,
    role: {
        type: String,
        default: 'Community Member'
    },
    bio: {
        type: String,
        default: ''
    },
    reputation: {
        type: Number,
        default: 0
    },
    questions: {
        type: Number,
        default: 0
    },
    answers: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    achievements: {
        type: [String],
        default: []
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }

    //------------------------
    ,googleId: {
    type: String
},
authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
}
//------------------------
});

// Create virtual 'id' that maps to '_id'
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Alias for joinedAt
userSchema.virtual('joined').get(function() {
    return this.joinedAt;
});

// Set toJSON to include virtuals
userSchema.set('toJSON', { 
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

// Hash password before saving
userSchema.pre('save', async function() {
    // if (!this.isModified('password')) {
    //     return;
    // }
    if (!this.isModified('password') || !this.password) {
    return;
}
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
