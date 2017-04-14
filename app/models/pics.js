'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pic = new Schema({
    owner: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Pic', Pic);