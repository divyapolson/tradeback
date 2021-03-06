var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
    title		: String,
    description	: String,
    image       : {
        type: String,
        default: null
    },
    location    : String,
    deadline    : Date,
    tags        : [String],
    status      : {
        type: Number,
        default: 0
    },
    offer       : {
        type: Boolean,
        default: true
    },
    author: String,
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Card', cardSchema);
