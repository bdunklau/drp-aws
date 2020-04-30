import { browser, by, element, Key } from 'protractor';
import * as protractor from 'protractor';
import * as request from 'request'; // https://stackoverflow.com/questions/45182309/making-an-api-call-while-running-protractor-tests
import * as _ from 'lodash';
import * as moment from 'moment';

//const server = 'http://172.31.28.156:3000/drpapi';
const server = 'http://'+process.env.DRP_API_SERVER+':3000/drpapi';

export class ChargeVehicleApi {

  constructor() { }

  async chargeVehicle(plate: string, location: string, date: number) {
    // let time = moment(date).format('Hmm');  //just the hours and mins 
    return this.post(`${server}/charge-vehicle`, {plate: plate, location: location, time: date});
  }

  async deleteVehicleCharges(args: any) {
    return this.post(`${server}/delete-vehicle-charges`, args);
  }


  // IDENTICAL method to post() in api-toll.po.ts
  async post(url, form) {
    // add something like this to get at env vars:  +process.env.YOURVOTECOUNTS_AUTH_KEY;

    var flow = protractor.promise.controlFlow();
    var result = await flow.execute(function() {
        var defer = protractor.promise.defer();
        request.post({url: url, form: form},
          function (error, response, body) {
            if (!error && response.statusCode === 200) {
                defer.fulfill(JSON.parse(body));
            }
          }
        );

        return defer.promise;
    });
    return result;
  }


  async getVehicleCharges(args: any) {
    var endpoint = `/get-vehicle-charges`
    if(args['plate']) endpoint += '/'+args['plate']
    if(args['time1'] && args['time2']) endpoint += '/range/'+args['time1']+'/'+args['time2'];
    else if(args['time1']) endpoint += '/since/'+args['time1'];
    else if(args['time2']) endpoint += '/until/'+args['time2'];
    var url = `${server}${endpoint}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    var flow = protractor.promise.controlFlow();
    var result = await flow.execute(function() {
        var defer = protractor.promise.defer();
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                defer.fulfill(JSON.parse(body));
            }
        });

        return defer.promise;
    });

    return result;

  }


  verifyCharges(expecteds: any,
                 actuals: any,
                 marker: string) {

    expect(expecteds.length === actuals.length)
    	.toBeTruthy(`expected size of result set to be ${expecteds.length} but it was actually ${actuals.length}  ${marker}`);
    

    _.each(expecteds, expected => {
	var theThing = {plate: expected['plate'], location: expected['location'], time: expected['time'], price: expected['price'] };
	/*****
	_.each(actuals, actual => {
	    console.log(`${marker}:  looking for: ${JSON.stringify(actual)}`) 
	})
       *****/
    	var found = _.find(actuals, theThing ); 
    	if(!found) {
	    fail(`${marker}: Could not find this in the actuals: ${JSON.stringify(theThing)}`);
	}
    })


  }


  verifyCharge(expected: any,
                 actual: any,
                 marker: string) {
 
    var attrs = ['plate', 'location', 'time', 'price'];
    _.each(attrs, attr => {
        this.verifyValue(expected, actual, attr, marker); 
    })

  }


  // IDENTICAL to api-toll.po.ts
  verifyValue(expected: any, actual: any, attr: string, marker: string) {
    var expType = typeof expected[attr];
    var actType = typeof actual[attr];
    expect(expected[attr] === actual[attr])
    	.toBeTruthy(`expected ${attr} to be ${expected[attr]} (a ${expType})  but it was actually ${actual[attr]} (a ${actType})  ${marker}`);
  }

}
