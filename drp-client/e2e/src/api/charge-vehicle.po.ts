import { browser, by, element, Key } from 'protractor';
import * as protractor from 'protractor';
import * as request from 'request'; // https://stackoverflow.com/questions/45182309/making-an-api-call-while-running-protractor-tests
import * as _ from 'lodash';
import * as moment from 'moment';

//const server = 'http://172.31.28.156:3000/drpapi';
const server = 'http://'+process.env.DRP_API_SERVER+':3000/drpapi';

export class ChargeVehicleApi {

  plate1:string;
  plate2:string;
      
  constructor() { 
      this.plate1 = '^^plate1^^';
      this.plate2 = '^^plate2^^';
  }

  getTime(Hmm: number) {
      var mm = Hmm % 100;
      var zz = Hmm - mm;
      var hr = zz / 100;

      return moment().set('hour', hr).set('minute', mm).valueOf();
      //return moment().set('hour', 9).set('minute', 9).valueOf();
  }

  async chargeVehicle(plate: string, city: string, location: string, date: number) {
    // let time = moment(date).format('Hmm');  //just the hours and mins 
    return this.post(`${server}/charge-vehicle`, {plate: plate, city: city, location: location, time: date});
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


  async get(url) {
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


  async getVehicleChargesByPlate(plate) {
    var url = `${server}/get-vehicle-charges/${plate}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return await this.get(url);    
  }


  async getVehicleChargesByPlateAndCity(plate, city) {
    var url = `${server}/get-vehicle-charges/${plate}/${city}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return await this.get(url);    
  }


  async getVehicleChargesByPlateSinceDate(plate, date1) {
    var url = `${server}/get-vehicle-charges/${plate}/since/${date1}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return await this.get(url);    
  }


  async getVehicleChargesByPlateUntilDate(plate, date2) {
    var url = `${server}/get-vehicle-charges/${plate}/until/${date2}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return await this.get(url);    
  }


  async getVehicleChargesByPlateBetweenTwoDates(plate, date1, date2) {
    var url = `${server}/get-vehicle-charges/${plate}/range/${date1}/${date2}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return await this.get(url);    
  }



  verifyCharges(expecteds: any,
                 actuals: any,
                 marker: string) {

    expect(expecteds.length === actuals.length)
    	.toBeTruthy(`expected size of result set to be ${expecteds.length} but it was actually ${actuals.length}  ${marker} \nHERE ARE THE EXPECTEDS:\n${JSON.stringify(expecteds)}\nHERE ARE THE ACTUALS:\n${JSON.stringify(actuals)}`);
    

    _.each(expecteds, expected => {
	var theThing = {plate: expected['plate'], city: expected['city'], location: expected['location'], time: expected['time'], price: expected['price'] };
	/*****
	_.each(actuals, actual => {
	    console.log(`${marker}:  looking for: ${JSON.stringify(actual)}`) 
	})
       *****/
    	var found = _.find(actuals, theThing ); 
    	if(!found) {
	    fail(`${marker}: Could not find this in the actuals: ${JSON.stringify(theThing)} HERE ARE THE ACTUALS: ${JSON.stringify(actuals)}`);
	}
    })


  }


  verifyChargesDeleted(expected: number, actual: any, marker: string) {
      var actualType = typeof actual;
      expect(expected === parseInt(actual)).toBeTruthy(`Expected the number of deleted charges=${expected} but actual value=${actual} (type: ${actualType})`);
  }


  verifyCharge(expected: any,
                 actual: any,
                 marker: string) {
 
    var attrs = ['plate', 'city', 'location', 'time', 'price'];
    _.each(attrs, attr => {
        this.verifyValue(expected, actual, attr, marker); 
    })

  }


  verifyBalance(expected: any, actual: any, marker: string) {
      this.verifyValue(expected, actual, 'balance', marker); 
  }


  // IDENTICAL to api-toll.po.ts
  verifyValue(expected: any, actual: any, attr: string, marker: string) {
    var expType = typeof expected[attr];
    var actType = typeof actual[attr];
    expect(expected[attr] === actual[attr])
    	.toBeTruthy(`expected ${attr} to be ${expected[attr]} (a ${expType})  but it was actually ${actual[attr]} (a ${actType})  ${marker}`);
  }

}
