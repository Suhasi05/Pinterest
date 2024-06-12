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
        ref: 'user',
    }
});

module.exports = mongoose.model('post', postSchema);