const express = require('express');
const mongoose = require('mongoose');
const BorrowBook = mongoose.model('BorrowBook');
const Books = require('../Models/books-model');
const users = mongoose.model('users');

exports.borrowBook = function(req, res) {
    let issueDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
    let dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 10);
    let borrow = new BorrowBook({
        email: req.body.email,
        isbn: req.body.isbn,
        issue_date: issueDate,
        due_date: dueDate
    });
    BorrowBook.find({email: req.body.email, returned: false}, (err, borrowedBooks) => {
        if (borrowedBooks.length > 4) {
            return res.status(502).send({
                message: 'You have issued maximum number of books allowed.'
            });
        } else {
            BorrowBook.find({isbn: req.body.isbn, returned: false, email: req.body.email}, (err, borrowed) => {
                if (err) {
                    return res.status(400).send({
                        message: 'Something went wrong'
                    });
                }
                if (borrowed.length === 0) {
                    Books.findOne({isbn: req.body.isbn}, (err, book) => {
                        if (err) {
                            return res.status(400).send({
                                message: 'Something went wrong.'
                            });
                        }
                        users.findOne({email: req.body.email}, (err, user) => {
                            if (err) {
                                return res.status(400).send({
                                    message: 'User not found.'
                                });
                            }
                            borrow.author = book.author;
                            borrow.title = book.title;
                            borrow.firstName = user.firstName;
                            borrow.lastName = user.lastName;
                            borrow.save((err, borrow) => {
                                if (err) {
                                    return res.status(400).send({
                                        message: 'Error in issueing book.'
                                    });
                                }
                                book.availableCopies = book.availableCopies - 1;
                                book.borrowedCopies = book.borrowedCopies + 1;
                                book.save((err, book) => {
                                    if (err) {
                                        return res.status(400).send({
                                            message: 'Something went wrong.'
                                        });
                                    }
                                    return res.status(200).send({
                                        message: 'Book issued successfully.',
                                        books: book,
                                        borrowed: borrow
                                    });
                                })
                            })
                        })
                    })
                } else {
                    return res.status(500).send({
                        message: 'You have alredy issued this book, please reissue this book if you want to have it for more time.'
                    });
                }
            })
        }
    })
}

exports.getAllBorrowedBooks = (req,res) => {
    BorrowBook.paginate({title: { $regex: '.*' + req.body.title + '.*', $options: 'i' }, author: { $regex: '.*' + req.body.author + '.*', $options: 'i' }, email: { $regex: '.*' + req.body.email + '.*', $options: 'i' }, issueDate: { $gte: start, $lte: end } }, { page: req.body.pageNumber, limit: 10, sort: { [req.body.sortColumn]: [req.body.sortDirection]} }, (err, books) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }
        return res.status(200).json({allbooks: books});
    })
}