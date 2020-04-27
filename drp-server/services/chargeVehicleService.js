
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
	let time = parseInt(this.req.body.time);

	let onSuccess = function(args) {
            // status, args, result, price <- these are the keys of args
            // we care about args['price']
	    try {
                MongoClient.connect(url, function(err, client) {
                    var db = client.db("drpDb");
                    assert.equal(null, err);
	            let vehicleCharge = {'plate': plate, 'price': args['price'], 'location': location, 'time': time};
                    self.insert(vehicleCharge, db, function(){
                        client.close()
                        return self.res.status(200).json({
                            status: 'charge vehicle',
			    // result: ?????  don't know what the result/return of the insert is
	                    args: {'plate': plate, 'location': location, 'time': time, 'price': args['price']}
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

	this.tollService.getToll_(location, time, onSuccess, onError);
    }


}
module.exports = ChargeVehicleService
