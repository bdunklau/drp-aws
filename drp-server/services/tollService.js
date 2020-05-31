const moment = require('moment');
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
	let city = this.req.body.city;
	let location = this.req.body.location;
	let timea = parseInt(this.req.body.timea);
	let timeb = parseInt(this.req.body.timeb);
	try {
            MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
                var db = client.db("drpDb");
                assert.equal(null, err);
		    /**********
	        let tollPrice = {'price': price, 'city': city, 'location': location, 'timea': timea, 'timeb': timeb};
                self.insert(tollPrice, db, function(){
                    client.close()
                    return self.res.status(200).json({
                        status: 'set toll',
			// result: ?????  don't know what the result/return of the insert is
	                args: {'price': price, 'city' :city , 'location': location, 'timea': timea, 'timeb': timeb}
                    })
                })
		*********/


	        let query = {'city': city, 'location': location, 'timea': timea, 'timeb': timeb};
		let update = {$set: {city: city, location: location, timea: timea, timeb: timeb, price: price}};
               	db.collection('tollPrices').updateMany(query, update, {upsert: true}).then(result => {
                	client.close()
                	return self.res.status(200).json({
                            status: 'set toll',
	            	    result: result,
	                    args: {'price': price, 'city' :city , 'location': location, 'timea': timea, 'timeb': timeb}
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


    getTollCount() {
        let self = this;
	let onSuccess = function(args) {
            return self.res.status(200).json(args);
	}
	let onError = function(args) {
	    return self.res.status(500).json(args);
	}

        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = [];
                var db = client.db("drpDb");
                let count = db.collection('tollPrices').countDocuments();
                onSuccess({
                    status: 'get toll count',
                    result: count
		}); 

            });
        }
        catch(error){
	    onError({
                status: 'error',
                error: error
	    });
        }
    }


    deleteTolls(){
        let self = this;
	let city = this.req.body.city;
	var parms = {city: city};
	if(this.req.body.location) parms['location'] = this.req.body.location;
	if(this.req.body.timea) parms['timea'] = parseInt(this.req.body.timea);
	if(this.req.body.timeb) parms['timeb'] = parseInt(this.req.body.timeb);
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                var db = client.db("drpDb");
		db.collection('tollPrices').deleteMany(parms, (err, collection) => {
                    if(err) throw err;
                    return self.res.status(200).json({
                        status: 'delete tolls',
	                args: parms,
                        result: collection.result.n 
                    })
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


    /*****
     * Returns a list of tolls and the price of the first toll.
     * This method kind of does double duty:  If we are looking for the price of a toll at a certain
     * location and time, we will care more about the 'price' attribute that's returned.
     *
     * If we are wanting to review the toll schedule for a city or city/location, we will care
     * more about the 'result' attribute
     */
    getToll_(parms) { //city, location, time /*(number)*/, onSuccess, onError) {
	//var city; var location; var time /*number*/; var onSuccess; var onError;
        
        //var args = {};
	var query = {};

	if(parms.city) {
         //   args['city'] = parms.city;
            query['city'] = parms.city;
        }

	if(parms.location) {
            //args['location'] = parms.location;
            query['location'] = parms.location;
        }

	if(parms.time) {
           // args['time'] = parms.time;
            let millis = parms.time;
	    let xxxxx = moment(millis).format('Hmm');
	    let time_hmm = parseInt(xxxxx);
            query['timea'] = {$lt: time_hmm};
            query['timeb'] = {$gt: time_hmm};
	}

	this.getToll_xxxx(parms, query);
    }


    getToll_exactMatch(parms) {
        
	var query = {};
	query['city'] = parms.city;
        query['location'] = parms.location;
	query['timea'] = parms.time;
	query['timeb'] = parms.time2;
	this.getToll_xxxx(parms, query);
    }


    getToll_xxxx(parms, query) {
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let tolls = [];
                var db = client.db("drpDb");
                let cursor = db.collection('tollPrices').find(query);
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        tolls.push(doc)
                    } else {
                        parms.onSuccess({
                            status: 'get toll',
			    args: parms,
			    query: query,
                            result: tolls,
		            price: tolls && tolls.length > 0 ? tolls[0].price : 0
			}); 
                    }
                });
            });
        }
        catch(error){
	    parms.onError({
                status: 'error',
                error: error
	    });
        }
    }


    getToll(){
        let self = this;
	let onSuccess = function(args) {
            return self.res.status(200).json(args);
	}
	let onError = function(args) {
	    return self.res.status(500).json(args);
	}

	var parms = {};
	parms['onSuccess'] = onSuccess;
	parms['onError'] = onError;
	if(this.req.params.city) parms['city'] = this.req.params.city;
	if(this.req.params.location) parms['location'] = this.req.params.location;
	if(this.req.params.time) parms['time'] = parseInt(this.req.params.time);
	if(this.req.params.time2) parms['time2'] = parseInt(this.req.params.time2);

        if(this.req.params.time2) {
	    this.getToll_exactMatch(parms);
	}
	else {
	    this.getToll_(parms);
	}
    }


    getTolls() {
        this.getToll();	
    }



}
module.exports = TollService
