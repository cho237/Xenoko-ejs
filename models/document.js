const mongoose = require('mongoose');
const Schema = mongoose.Schema

const documentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    frontImage: {
        type: String,
        required: true
    },
    backImage: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    
})

module.exports = mongoose.model('Document',documentSchema)