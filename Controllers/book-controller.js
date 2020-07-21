const express = require('express');
const mongoose = require('mongoose');
const Books = require('../Models/books-model');

exports.addBook = function(req, res, next) {
    const books = new Books({
        _id: new mongoose.Types.ObjectId(),
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        noOfCopies: parseInt(req.body.noOfCopies),
        availableCopies: parseInt(req.body.noOfCopies),
        coverImageURL: req.body.coverImageURL,
        coverImage: req.file ? req.file.path : null,
        category: req.body.category,
    });
    books.save((err, book) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            return res.status(200).send({
                message: 'Book added successfully'
            })
        }
    });
}

exports.getAllBooks = function(req, res) {
    Books.paginate({title: { $regex: '.*' + req.body.title + '.*', $options: 'i' }, author: { $regex: '.*' + req.body.author + '.*', $options: 'i' } }, { page: req.body.pageNumber, limit: 10 }, (err, books) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({ allbooks: books});
        }

    })
}

exports.getUserAllBooks = function(req, res) {
    Books.paginate({title: { $regex: '.*' + req.body.title + '.*', $options: 'i' }, author: { $regex: '.*' + req.body.author + '.*', $options: 'i' }, category: { $regex: '.*' + req.body.category + '.*' } }, { page: req.body.pageNumber, limit: 20 }, (err, books) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({ allbooks: books});
        }

    })
}

exports.updateBook = function(req, res) {
    Books.findOne({isbn: req.body.isbn}, (err, book) => {
        if (err) {
            return res.status(400).send({
                message: 'Book not found'
            });
        } else {
            book.isbn = req.body.isbn;
            book.title = req.body.title;
            book.author = req.body.author;
            book.description = req.body.description;
            book.availableCopies = parseInt(book.availableCopies) + (parseInt(req.body.noOfCopies) - parseInt(book.noOfCopies));
            book.noOfCopies = req.body.noOfCopies;
            book.coverImageURL = req.body.coverImageURL;
            book.coverImage = req.file ? req.file.path : null,
            book.category = req.body.category;
            book.save((err, book1) => {
                if (err) {
                    return res.status(400).send({
                        message: 'Update unsuccessful'
                    });
                } else {
                    return res.status(200).send({
                        message: 'Update successful'
                    });
                }
            })
        }
    });
}

exports.getBookDetails = function(req, res) {
    Books.findOne({isbn: req.body.isbn}, (err, book) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({ bookDetails: book});
        }
    });
}

exports.deleteBook = function(req, res) {
    Books.deleteOne({isbn: req.body.isbn}, (err, book) => {
        if (err) {
            return res.status(400).send({
                message: 'Book not found'
            });
        } else {
            return res.status(200).send({
                message: 'Book deleted successfully'
            });
        }
    })
}