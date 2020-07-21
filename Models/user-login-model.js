var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bycrypt = require("bcrypt");
var Schema = mongoose.Schema;

var UserLoginSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String
    }
});

UserLoginSchema.plugin(passportLocalMongoose);
UserLoginSchema.methods.comparePassword = function(password) {
    return bycrypt.compareSync(password, this.password);
};

mongoose.model('users', UserLoginSchema);