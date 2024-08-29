const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'people',
    }
});

module.exports = mongoose.model('feed', postSchema);