const moment = require('moment');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.31.28.156:27017";



class ChargeVehicleService{
    
    constructor(req, res, tollService){
        this.req = req;
        this.res = res;
	this.tollService = tollService;
    }

    insert(vehicleCharge, db, callback){
        db.collection('vehicleCharges').insertOne(vehicleCharge,
        function(){
            callback()      
        })
    }

    // body/form parameters:  plate, location, time	
    chargeVehicle() {
        let self = this;
	let plate = this.req.body.plate;
	let location = this.req.body.location;
	let millis = parseInt(this.req.body.time);
	let date = moment(millis).format('ddd, MMM Do YYYY, h:mm:ss a');
	let time_hmm = parseInt(moment(millis).format('Hmm'));

	let onSuccess = function(args) {
            // status, args, result, price <- these are the keys of args
            // we care about args['price']
	    try {
                MongoClient.connect(url, function(err, client) {
                    var db = client.db("drpDb");
                    assert.equal(null, err);
	            let vehicleCharge = {'plate': plate, 'price': args['price'], 'location': location, 'time': millis, 'date': date, 'millis': millis};
                    self.insert(vehicleCharge, db, function(){
                        client.close()
                        return self.res.status(200).json({
                            status: 'charge vehicle',
			    // result: ?????  don't know what the result/return of the insert is
	                    args: vehicleCharge
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

	this.tollService.getToll_(location, time_hmm, onSuccess, onError);
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


    getVehicleCharges() {
        let self = this;
	var queryParams;
	let plate = this.req.params.plate;
	var date1 = this.req.params.date1;
	var date2 = this.req.params.date2;
	var args = {};
	if(date1) args['date1'];
	if(date2) args['date2'];
       
	if(this.req.params.plate) {
            args['plate'] = this.req.params.plate;
	    if(date1 && date2) 
                queryParams = {$and: [{plate: plate}, {time: {$gt: parseInt(date1) }}, {time: {$lt: parseInt(date2) }} ] };
	    else if(date1) queryParams = {$and: [{plate: plate}, {time: {$gt: parseInt(date1) }}  ] };
	    else if(date2) queryParams = {$and: [{plate: plate}, {time: {$lt: parseInt(date2) }}  ] };
	    else queryParams = {plate: plate};
	}
	else {  // no plate, search for all plates
	    if(date1 && date2) queryParams = {$and: [ {time: {$gt: parseInt(date1) }}, {time: {$lt: parseInt(date2) }} ] };
	    else if(date1) queryParams = {time: {$gt: parseInt(date1) }};
	    else if(date2) queryParams = {time: {$lt: parseInt(date2) }};
	}


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
