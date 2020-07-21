'use strict';
var mongoose = require('mongoose');
var users = mongoose.model('users');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const baseUrl = 'http://localhost:4001/';
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require("async");
var crypto = require("crypto");

exports.register = (req, res) => {
    var newUser = new users(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.password = undefined;
            return res.json(user);
        }
    });
};

exports.sign_in = function (req, res) {
    users.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'User does not exists' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Incorrect Email/Password' });
            } else {
                return res.json({ token: jwt.sign({ email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id }, 'RESTFULAPIs'), data: user });
            }
        }
    });
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
};

exports.forgotPassword = function (req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            users.findOne({ email: req.body.email}, function(err, user) {
                if (!user) {
                    return res.status(401).json({ message: 'User does not exists' });
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'limsv21994@gmail.com',
                    pass: 'Pass$1994'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'limsv21994@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the rest of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser o complete the process:\n\n' +
                'http://localhost:4200/reset;token=' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remian unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                return res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions'});
            });
        }
    ], function(err) {
        if (err) {
            return res.status(400).json({ message : err });
        }
    })
}

exports.resetPassword = function(req, res) {
    async.waterfall([
        function(done) {
            users.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user) {
                if (!user) {
                    return res.status(401).json({ message: 'Password reset token is invalid or has expired' });
                }
                if (req.body.password === req.body.confirm) {
                    user.password = bcrypt.hashSync(req.body.password, 10);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        done(err, user);
                    });
                } else {
                    return res.status(401).json({ message: 'Passwords do not match' });
                }
            })
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'limsv21994@gmail.com',
                    pass: 'Pass$1994'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'limsv21994@gmail.com',
                subject: 'Password Reset Successfull',
                text: 'Hello,\n\n'+
                'This is a confirmation that the password fro your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                return res.status(200).json({ message: 'Success! Your password has been changed'});
            });
        }
    ], function(err) {
        if (err) {
            return res.status(400).json({ message : err });
        }
    });
}