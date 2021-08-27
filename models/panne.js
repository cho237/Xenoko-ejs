const getDb = require('../util/database').getDb;

class Panne{
    constructor(){}



    save(){
        const db = getDb();
        return db.collection('panne')
        .insertOne(this)
        .then(result => console.log(result))
        .catch(err=>console.log(err))
    }
}