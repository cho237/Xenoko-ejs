const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const driverSchema = new Schema({
   fname: {
       type: String,
       required: true
   },

   lname: {
       type: String,
       required: true
   },

   salary :{
    type: Number,
    required: true
   },

   profile: {
    type: String ,
    required: true
   },

   contact: {
    type: Number,
    required : true
   },

   user: {
       type :Schema.Types.ObjectId,
       ref:'User',
       required : true
   },
   documents : [{
    type :Schema.Types.ObjectId,
    ref:'Document'
  }]

})

module.exports = mongoose.model('Driver',driverSchema)