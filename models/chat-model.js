const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    stamp: {
        type: Date,
        default: Date.now
    },
    message:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024,
        trim: true
    }

})
const ChatModel = mongoose.model('chats', schema);

exports.ChatModel = ChatModel;