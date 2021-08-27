const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema ({
    immatriculation : {
        type : String,
        required : true
    },
    model : {
        type : String,
        required : true
    },
    brand :  {
        type : String,
        required : true
    },
    chasis :  {
        type : String,
        required : true
    },
    status :  {
        type : String,
        required : true
    },
    image :  {
        type : String,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    drivers : [{
            type :Schema.Types.ObjectId,
            ref:'Driver'
        
    }],
    revenues : [{
        type :Schema.Types.ObjectId,
        ref:'Revenue'
    }],
    documents : [{
        type :Schema.Types.ObjectId,
        ref:'Document'
    }]
    
})

module.exports = mongoose.model('Car', carSchema)

