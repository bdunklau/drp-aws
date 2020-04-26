import { browser, by, element, Key } from 'protractor';
import * as protractor from 'protractor';
import * as request from 'request'; // https://stackoverflow.com/questions/45182309/making-an-api-call-while-running-protractor-tests
import * as _ from 'lodash';

//const server = 'http://172.31.28.156:3000/drpapi';
const server = 'http://'+process.env.DRP_API_SERVER+':3000/drpapi';

export class TollApi {

  constructor() { }

  async getToll(location: string, time: number) {

    var url = `${server}/get-toll/${location}/${time}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
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


  async setToll(price: number, location: string, timea: number, timeb: number) {
    return this.post(`${server}/set-toll`, {price: price, location: location, timea: timea, timeb: timeb});
  }

  async deleteTolls(args: any) {
    return this.post(`${server}/delete-tolls`, args);
  }


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


  verifyTollJson(expected: any /*{price: number, location: string, timea: number, timeb: number}*/,
                 actual: any,
                 marker: string) {
 
    var attrs = ['price', 'location', 'timea', 'timeb'];
    _.each(attrs, attr => {
        this.verifyValue(expected, actual, attr, marker); 
    })

  }

  verifyValue(expected: any, actual: any, attr: string, marker: string) {
    var expType = typeof expected[attr];
    var actType = typeof actual[attr];
    expect(expected[attr] === actual[attr]).toBeTruthy(`expected ${attr} to be ${expected[attr]} (a ${expType})  but it was actually ${actual[attr]} (a ${actType})  ${marker}`);
  }

  verifyPrice(expected: number, actual: number, marker: string) {
    //expect(expected+'' === actual+'').toBeTruthy(`expected price to be ${expected} but it was actually ${actual} ${marker}`);
    this.verifyValue({price: expected}, {price: actual}, 'price', marker); 
  }

  verifyDelete(expected: any, actual: any, marker: string) {
    //expect(expected === actual).toBeTruthy(`expected location to be ${expected} but it was actually ${actual} ${marker}`);
    this.verifyValue(expected, actual, 'location', marker); 
  }

  verifyLocation(expected: string, actual: string, marker: string) {
    //expect(expected+'' === actual+'').toBeTruthy(`expected location to be ${expected} but it was actually ${actual} ${marker}`);
    this.verifyValue({location: expected}, {location: actual}, 'location', marker); 
  }
}
