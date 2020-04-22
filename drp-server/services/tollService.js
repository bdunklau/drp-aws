
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.31.28.156:27017";



class TollService{
    
    constructor(req, res){
        this.req = req
        this.res = res
    }

    insert(tollPrice, db, callback){
        db.collection('tollPrices').insertOne(tollPrice,
        function(){
            callback()      
        })
    }

    // body/form parameters:  price, location, timea, timeb	
    setToll() {
        let self = this;
	let price = this.req.body.price;
	let location = this.req.body.location;
	let timea = this.req.body.timea;
	let timeb = this.req.body.timeb;
	try {
            MongoClient.connect(url, function(err, client) {
                var db = client.db("drpDb");
                assert.equal(null, err);
	        let tollPrice = {'price': price, 'location': location, 'timea': timea, 'timeb': timeb};
                self.insert(tollPrice, db, function(){
                    client.close()
                    return self.res.status(200).json({
                        status: 'success'
                    })
                })
            });
	}
	catch(error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
	}
    }


    getToll(){
        let self = this;
	let location = this.req.params.location;
	let time = this.req.params.time;
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = []

                var db = client.db("drpDb");
                let cursor = db.collection('tollPrices').find({location: location, timea: {$lt: time}, timeb: {$gt: time}});
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        tolls.push(doc)
                    } else {
                        return self.res.status(200).json({
                            statusXXXXX: 'success',
                            data: tolls
                        })
                    }
                });
            });
        }
        catch(error){
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }

}
module.exports = TollService
