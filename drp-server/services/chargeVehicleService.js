const moment = require('moment');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.31.28.156:27017";



class ChargeVehicleService{
    
    constructor(req, res, tollService, accountSummaryService){
        this.req = req;
        this.res = res;
	this.tollService = tollService;
	this.accountSummaryService = accountSummaryService;
    }

    insert(vehicleCharge, db, callback){
        db.collection('vehicleCharges').insertOne(vehicleCharge,
        function(){
            callback()      
        })
    }

    tempInsert() {
        let self = this;
	let plate = this.req.params.plate;
	let balance = parseFloat(this.req.params.balance);
	try {
            MongoClient.connect(url, function(err, client) {
                var db = client.db("drpDb");
                /*let results =*/ db.collection('accountSummaries')
			.updateOne({plate: plate}, 
				{$inc: {balance: balance}, $set: {plate: plate}}, 
				{upsert: true} )
                   
		let results = [];
                let cursor = db.collection('accountSummaries').find({plate: plate})
		    //.project({_id:0, balance: 1}); // <-- means just return the 'balance' field
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        results.push(doc); 
                    } else {
                        self.res.status(200).json({
                            status: 'temp insert',
                            args: 'no args here',
                            result: results 
                        });
                    }
                });
		client.close();


	    })
	} catch(error) {
            self.res.status(500).json({
                status: 'error',
                error: error
            });

	}
    }

    tempDelete() {
        let self = this;
	try {
            MongoClient.connect(url, function(err, client) {
                var db = client.db("drpDb");
		let results = [];
                db.collection('accountSummaries').deleteMany({}, function(ierr, obj) {
		    if(err) throw err;
                    self.res.status(200).json({
                        status: 'temp delete',
                        args: obj.result.n+' records deleted',
                        result: results 
                    });
		 
	            client.close();
		})

		    //.project({_id:0, balance: 1}); // <-- means just return the 'balance' field

	    })
	} catch(error) {
            self.res.status(500).json({
                status: 'error',
                error: error
            });

	}
    }

    tempGet() {
        let self = this;
	try {
            MongoClient.connect(url, function(err, client) {
                var db = client.db("drpDb");
		let results = [];
                let cursor = db.collection('accountSummaries').find()
		    //.project({_id:0, balance: 1}); // <-- means just return the 'balance' field
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        results.push(doc); 
                    } else {
                        self.res.status(200).json({
                            status: 'get vehicle balance',
                            args: 'no args here',
                            result: results 
                        });
                    }
                });

	    })
	} catch(error) {
            self.res.status(500).json({
                status: 'error',
                error: error
            });

	}
    }

    tempAcc() {
        let self = this;
	let plate = this.req.params.plate;
       
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
		let balance = -1;

                var db = client.db("drpDb");
               db.collection.update(query, update, {upsert: true});


		    db.collection('accountSummaries').updateOne({"plate": plate}, { $inc: {"balance": 5}}, function(err, res2) {
			    let xxx = db.collection('accountSummaries').findOne({"plate": plate});
                             
			    //client.close();


                //let cursor = db.collection('accountSummaries').find({plate: plate}, {"_id":0,  "plate":0});
                let cursor = db.collection('accountSummaries').find({plate: plate})
		    .project({_id:0, balance: 1}); // <-- means just return the 'balance' field
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        balance = doc; 
                    } else {
                        self.res.status(200).json({
                            status: 'get vehicle balance',
                            args: {plate: plate},
                            result: balance
                        });
                    }
                });




                        

			} );







            });
        }
        catch(error){
            self.res.status(500).json({
                status: 'error',
                error: error
            });
        }
    }
    

    // get the balance for one vehicle
    getAccountSummary() {
        let self = this;
	let plate = this.req.params.plate;
       
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
		let balance = -1;

                var db = client.db("drpDb");
                //let cursor = db.collection('accountSummaries').find({plate: plate}, {"_id":0,  "plate":0});
                let cursor = db.collection('accountSummaries').find({plate: plate})
		    .project({_id:0, balance: 1}); // <-- means just return the 'balance' field
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        balance = doc; 
                    } else {
                        self.res.status(200).json({
                            status: 'get vehicle balance',
                            args: {plate: plate},
                            result: balance
                        });
                    }
                });
            });
        }
        catch(error){
            self.res.status(500).json({
                status: 'error',
                error: error
            });
        }
    }
    

    // body/form parameters:  plate, location, time	
    chargeVehicle() {
        let self = this;
	let plate = this.req.body.plate;
	let location = this.req.body.location;
	let city = this.req.body.city;
	let millis = parseInt(this.req.body.time);
	let date = moment(millis).format('ddd, MMM Do YYYY, h:mm:ss a');
	//let time_hmm = parseInt(moment(millis).format('Hmm'));

        //console.log('chargeVehicle(): millis = ', millis);
        //console.log('chargeVehicle(): date = ',date );
        //console.log('chargeVehicle(): time_hmm = ', time_hmm);

	let onSuccess = function(args) {
            // status, args, result, price <- these are the keys of args
            // we care about args['price']
	    try {
                MongoClient.connect(url, function(err, client) {
                    var db = client.db("drpDb");
                    assert.equal(null, err);
	            let vehicleCharge = {'plate': plate, 'city': city, 'price': args['price'], 'location': location, 'time': millis, 'date': date, 'millis': millis};
	            //let balance = {balance: -1};
                    self.insert(vehicleCharge, db, async function(){

			    /*********************
                        db.collection('accountSummaries').updateOne({"plate": plate}, { $inc: {"balance": args['price']}}, function(err, res2) {
			    let xxx = db.collection('accountSummaries').findOne({"plate": plate});
                             
			    client.close();
                        
                            return self.res.status(200).json({
                                status: 'charge vehicle',
	                        args: vehicleCharge,
		                //balance: res2.result 
			        balance: 'check browser' 
                            })
			} );
                             ***************/



                        /*let results =*/ db.collection('accountSummaries')
		        .updateOne({plate: plate}, 
				{$inc: {balance: args['price']}, $set: {plate: plate}}, 
				{upsert: true} )
		        .then(doc => {
				/********
                            console.log('chargeVehicle(): updateOne -> doc.matchedCount = ', doc.matchedCount);
                            console.log('chargeVehicle(): updateOne -> doc.modifiedCount = ', doc.modifiedCount);
                            console.log('chargeVehicle(): updateOne -> doc.upsertedId = ', doc.upsertedId);
                                  *********/
		            let results = [];
                            let cursor = db.collection('accountSummaries').find({plate: plate})
		            //.project({_id:0, balance: 1}); // <-- means just return the 'balance' field
                            if(!cursor) throw "no cursor";
                            cursor.each(function(err, doc) {
                                if(err) throw err;
                                assert.equal(err, null);
                                if (doc != null) {
                                    results.push(doc); 
                                } else {
                                    self.res.status(200).json({
                                        status: 'charge vehicle',
                                        args: vehicleCharge,
                                        result: results 
                                    });
                                }
                            });
                            client.close();
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

	let onError = function(args) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
	}

	this.tollService.getToll_({city: city, location: location, time: millis, onSuccess: onSuccess, onError: onError});
    }


    deleteVehicleCharges() {
        let self = this;
        let plate = this.req.body.plate;
        let parms = {plate: plate};
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                var db = client.db("drpDb");
		db.collection('accountSummaries').deleteOne(parms);
                db.collection('vehicleCharges').deleteMany(parms, (err, collection) => {
                    if(err) throw err;
                    return self.res.status(200).json({
                        status: 'delete vehicle charges',
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


    getVehicleChargesByPlate() {
	var args = {
	    plate: this.req.params.plate
	};
	var queryParams = args;
	return this.getVehicleCharges(args, queryParams);
    }


    getVehicleChargesByPlateAndCity() {
	var args = {
	    plate: this.req.params.plate,
            city: this.req.params.city
	};
	var queryParams = args;
	return this.getVehicleCharges(args, queryParams);
    }


    getVehicleChargesByPlateSinceDate() {
	var args = {
	    plate: this.req.params.plate,
            date1: this.req.params.date1
	};
        var queryParams = {$and: [{plate: this.req.params.plate}, {time: {$gt: parseInt(this.req.params.date1) }} ] };
	return this.getVehicleCharges(args, queryParams);
    }


    getVehicleChargesByPlateUntilDate() {
	var args = {
	    plate: this.req.params.plate,
	    date2: this.req.params.date2
	};
        var queryParams = {$and: [{plate: this.req.params.plate}, {time: {$lt: parseInt(this.req.params.date2) }} ] };
	return this.getVehicleCharges(args, queryParams);

    }


    getVehicleChargesByPlateBetweenTwoDates() {
	var args = {
	    plate: this.req.params.plate,
            date1: this.req.params.date1,
	    date2: this.req.params.date2
	};
        var queryParams = {$and: [{plate: this.req.params.plate}, {time: {$gt: parseInt(this.req.params.date1) }}, {time: {$lt: parseInt(this.req.params.date2) }} ] };
	return this.getVehicleCharges(args, queryParams);
    }


    getVehicleCharges(args, queryParams) {
        let self = this;
        try{
            MongoClient.connect(url, function(err, client) {
                if(err) throw err;
                assert.equal(null, err);
                let vehicleCharges = []

                var db = client.db("drpDb");
                let cursor = db.collection('vehicleCharges').find(queryParams);
                if(!cursor) throw "no cursor";
                cursor.each(function(err, doc) {
                    if(err) throw err;
                    assert.equal(err, null);
                    if (doc != null) {
                        vehicleCharges.push(doc)
                    } else {
                        self.res.status(200).json({
                            status: 'get vehicle charges',
                            args: args,
                            result: vehicleCharges
                        });
                    }
                });
            });
        }
        catch(error){
            self.res.status(500).json({
                status: 'error',
                error: error
            });
        }
    }





}
module.exports = ChargeVehicleService
