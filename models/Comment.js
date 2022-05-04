const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        // References a user ID from the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String,
        required: true,
    },
    likes: {
        // String of IDs
        type: [String]
    },
    // Show if this comment is a reply to another. Get ID of comment being replied to 
    replyTo: String,
    date: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    }
});

module.exports = Comment = mongoose.model('comment', CommentSchema);