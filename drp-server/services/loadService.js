const moment = require('moment');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.31.28.156:27017";
const _ = require('lodash');


class LoadService{
    
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
    loadTolls() {
        let self = this;
        console.log('req.body.tolls = ', this.req.body.tolls);
	let tolls = this.req.body.tolls;

        let inserts = _.map(tolls, toll => {return {insertOne: toll}})
        console.log('inserts = ', inserts);

	try {
            MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
                var db = client.db("drpDb");
                assert.equal(null, err);

               	db.collection('tollPrices').bulkWrite(inserts, {ordered:true}).then(result => {
                	client.close()
                	return self.res.status(200).json({
                            status: 'load tolls',
	            	    result: result
                        })
			
		    })
		    .catch(err => {
			console.log(`error: ${err}`);
                        return self.res.status(500).json({
                            status: 'error',
                            error: err
                        })
		    });

            });
	}
	catch(error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
	}
    }


}
module.exports = LoadService
