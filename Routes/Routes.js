"use strict";
var cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = function (app) {
    var user = require("../Controllers/user-login-controller");
    var books = require("../Controllers/book-controller");
    var borrowedBooks = require("../Controllers/borrow-book-controller");

    app.use(cors());

    app.route("/user/register").post(user.register);
    app.route("/user/signin").post(user.sign_in);
    app.route("/user/forgot").post(user.forgotPassword);
    app.route("/user/reset").post(user.resetPassword);
    app.route("/admin/addBook").post(upload.single('coverImage'), books.addBook);
    app.route("/admin/updateBook").post(upload.single('coverImage'), books.updateBook);
    app.route("/admin/deleteBook").post(books.deleteBook);
    app.route("/getAllBooks").post(books.getAllBooks);
    app.route("/user/getAllBooks").post(books.getUserAllBooks);
    app.route("/user/getBookDetails").post(books.getBookDetails);
    app.route("/user/borrow").post(borrowedBooks.borrowBook);
    app.route("/admin/getAllBorrowedBooks").post(borrowedBooks.getAllBorrowedBooks);

};