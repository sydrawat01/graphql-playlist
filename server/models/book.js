const mongoose = require('mongoose');

const {Schema} = mongoose;

const bookSchema = new Schema({
    title: String,
    genre: String,
    authorID: String
})

module.exports = mongoose.model('Book', bookSchema);