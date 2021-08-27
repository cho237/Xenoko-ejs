const getDb = require('../util/database').getDb;

class AdvancementSalarial{
    constructor(){}



    save(){
        const db = getDb();
        return db.collection('advancementSalarial')
        .insertOne(this)
        .then(result => console.log(result))
        .catch(err=>console.log(err))
    }
}