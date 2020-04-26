
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
	let price = parseFloat(this.req.body.price);
	let location = this.req.body.location;
	let timea = parseInt(this.req.body.timea);
	let timeb = parseInt(this.req.body.timeb);
	try {
            MongoClient.connect(url, function(err, client) {
                var db = client.db("drpDb");
                assert.equal(null, err);
	        let tollPrice = {'price': price, 'location': location, 'timea': timea, 'timeb': timeb};
                self.insert(tollPrice, db, function(){
                    client.close()
                    return self.res.status(200).json({
                        status: 'set toll',
			// result: ?????  don't know what the result/return of the insert is
	                args: {'price': price, 'location': location, 'timea': timea, 'timeb': timeb}
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


    deleteTolls(){
        let self = this;
	let location = this.req.body.location;
	let parms = {location: location};    
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = []

                var db = client.db("drpDb");
                let result = db.collection('tollPrices').deleteMany(parms);
                return self.res.status(200).json({
                    status: 'delete tolls',
	            args: parms,
                    result: result 
                })

            });
        }
        catch(error){
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }


    getToll(){
        let self = this;
	let location = this.req.params.loc;
	let time = parseInt(this.req.params.time);
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = []

                var db = client.db("drpDb");
                let cursor = db.collection('tollPrices').find({location: location,  timea: {$lt: time} , timeb: {$gt: time} });
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        tolls.push(doc)
                    } else {
                        return self.res.status(200).json({
                            status: 'get toll',
			    args: {location: location, time: time},
                            result: tolls,
		            doc: doc,
		            price: tolls && tolls.length > 0 ? tolls[0].price : 0
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


    getTolls(){
        let self = this;
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = []
                var db = client.db("drpDb");
                let cursor = db.collection('tollPrices').find();
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        tolls.push(doc)
                    } else {
                        return self.res.status(200).json({
                            status: 'success',
                            result: tolls
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
