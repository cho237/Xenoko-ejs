const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;
let _db ;

const mongoconnect = (callback)=>{
    mongoClient.connect('mongodb+srv://cho237:atenchong@cluster0.cblz1.mongodb.net/Zenoko?retryWrites=true&w=majority')
    .then(client=>{
        console.log('conected!')
        _db = client.db()
        callback() 
    })
    .catch(err=>{
        console.log(err)
        throw err;
    });
}

const getDb = ()=>{
    if(_db){
        return _db
    }
    throw 'No db found'
}

exports.mongoconnect = mongoconnect;
exports.getDb = getDb;

