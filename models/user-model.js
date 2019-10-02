const mongooose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken')

const schema = new mongooose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 4,
        maxlength: 12,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30,
        unique: true
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 30,
    },
    country: {
        type: Number,
        required: true,
        min: 0,
        max: 2,
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false
    },
    socketId: {
        type: String,
        required: true,
        default: 'none'
    },
    friends: {
        type: Array,
        default: []
    },
    requests: {
        type: Array,
        default: []
    }
});
schema.methods.generateToken = function() {
    return jwt.sign({_id: this._id}, 'mysecrets');
}
const UserModel = mongooose.model('user', schema);

function validateUserRegisteration(user) {
    const joiSchema = {
        username: joi.string().required().min(4).max(12).lowercase(),
        email: joi.string().required().min(5).max(30),
        dob: joi.date().required(),
        password: joi.string().min(4).max(30),
        country: joi.number().min(0).max(3).required()
    }
    return joi.validate(user, joiSchema);
}

function validateUserLogin(user) {
    console.log(user);
    
    const joiSchema = {
        username: joi.string().required().min(4).max(12).lowercase(),
        password: joi.string().min(4).max(30),
    }
    return joi.validate(user, joiSchema);
}
exports.validateUserRegisteration = validateUserRegisteration;
exports.validateUserLogin = validateUserLogin;

exports.UserModel = UserModel;