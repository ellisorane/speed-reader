const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = User = mongoose.model('user', UserSchema);