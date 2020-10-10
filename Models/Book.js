const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdBy : {
        type: String,
    },
    titleBook: {
        type: String,
        required: true
    },
    priceBook: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Book = mongoose.model('book', BookSchema)