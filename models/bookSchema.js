const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: String,
    comments: {
        type: Array,
        default: []
    },
    commentcount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Books', BookSchema);