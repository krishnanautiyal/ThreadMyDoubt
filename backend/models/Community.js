const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a community name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    category: {
        type: String,
        default: 'General'
    },
    icon: {
        type: String,
        default: 'fa-users'
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


communitySchema.pre('save', async function () {
    if (!this.isModified('name')) return;

    let baseSlug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;

    // 🔥 Fix duplicate logic (IMPORTANT)
    while (await mongoose.models.Community.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
});

// Virtual 'id'
communitySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Include virtuals in JSON
communitySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Community', communitySchema);