const mongoose = require('mongoose');
const driver = require('./driver');
const Schema = mongoose.Schema;

const revenueSchema = new Schema({
    date: {
        type: Date,
        required : true
    },
    car: {
        type: Schema.Types.ObjectId,
        ref:'Car',
        required: true 
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref:'Driver',
        required : true 
    },
    amount:{
        type: Number,
        required: true 
    },
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    failureDescription: String,
    failureAmount: Number,
    total:{
        type: Number,
        required: true 
    },
})


module.exports = mongoose.model('Revenue',revenueSchema)