var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    isbn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    noOfCopies: {
        type: Number,
        required: true,
    },
    availableCopies: {
        type: Number,
        required: true,
    },
    borrowedCopies: {
        type: Number,
        default: 0
    },
    coverImageURL: {
        type: String
    },
    coverImage: {
        type: String
    },
    category: {
        type: String,
    }

});
BookSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Books", BookSchema);