var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var BorrowBookSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    issue_date : {
        type: Date,
        required: true,
    },
    due_date : {
        type: Date,
        required: true
    },
    return_date : {
        type: Date,
    },
    returned: {
        type: Boolean,
        default : false
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});
BorrowBookSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("BorrowBook", BorrowBookSchema);