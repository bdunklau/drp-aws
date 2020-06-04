const moment = require('moment-timezone');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.31.28.156:27017";



class InitService{
    
    constructor(req, res){
        this.req = req
        this.res = res
    }


    init() {
        let self = this;
	try {
            MongoClient.connect(url, function(err, client) {
		let results = [];
                var db = client.db("drpDb");
		db.createCollection('accountSummaries');
		results.push('created collection: accountSummaries');
		db.collection('accountSummaries').createIndex( { "plate": 1 }, { unique: true } );
		results.push('create unique index on collections.plate');
                client.close();
		return self.res.status(200).json({
                    status: 'InitService.init()',
                    results: results
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


    getTime() {
        let millis = parseInt(this.req.params.timestamp);
        let thetime = moment(millis).format('MM-DD-YYYY Hmm:ss.SSS');
	let central = moment(millis).tz('America/Chicago').format('MM-DD-YYYY Hmm:ss.SSS')
	let eastern = moment(millis).tz('America/New_York').format('MM-DD-YYYY Hmm:ss.SSS')
	return this.res.status(200).json({status: 'get time', 
		note: `HERE IS ${millis} AS CENTRAL, EASTERN AND UTC TIME`,
		input: millis, 
		central_time: central,
		eastern_time: eastern,
		utc_time: thetime});
    }

}
module.exports = InitService
