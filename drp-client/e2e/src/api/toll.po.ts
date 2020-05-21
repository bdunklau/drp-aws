import { browser, by, element, Key } from 'protractor';
import * as protractor from 'protractor';
import * as request from 'request'; // https://stackoverflow.com/questions/45182309/making-an-api-call-while-running-protractor-tests
import * as _ from 'lodash';

//const server = 'http://172.31.28.156:3000/drpapi';
const server = 'http://'+process.env.DRP_API_SERVER+':3000/drpapi';

export class TollApi {

    price1:number; 
    price2:number; 
    price3:number; 
    price4:number; 
    price5:number; 
    price6:number;
    cityA:string; 
    cityB:string;
    loc1:string; 
    loc2:string;
    time1:number; 
    time2:number;
    time3:number; 
    time4:number;
    timestamp1:number;
    timestamp2:number;

    actual:any;
    input1: {price:number, city:string, location:string, timea:number, timeb:number};
    input2: {price:number, city:string, location:string, timea:number, timeb:number};
    input3: {price:number, city:string, location:string, timea:number, timeb:number};
    input4: {price:number, city:string, location:string, timea:number, timeb:number};
    input5: {price:number, city:string, location:string, timea:number, timeb:number};
    input6: {price:number, city:string, location:string, timea:number, timeb:number};
    cityASchedule:any;
    cityBSchedule:any;

    constructor() { 
        this.price1 = 303; 
        this.price2 = 404; 
        this.price3 = 505; 
        this.price4 = 606; 
        this.price5 = 707; 
        this.price6 = 808;
        this.cityA = 'CityA'; 
        this.cityB = 'CityB';
        this.loc1 = '3 Elm Ln'; 
        this.loc2 = '505 Elm Ln';
        this.time1 = 900; 
        this.time2 = 1300;
        this.time3 = 1300; 
        this.time4 = 1700;
        this.timestamp1 = 1465215250000;
        this.timestamp2 = 1465195250000;

        this.input1 = {price: this.price1, city: this.cityA, location: this.loc1, timea: this.time1, timeb: this.time2};
        this.input2 = {price: this.price2, city: this.cityA, location: this.loc1, timea: this.time3, timeb: this.time4};
        this.input3 = {price: this.price3, city: this.cityA, location: this.loc2, timea: this.time1, timeb: this.time2};
        this.input4 = {price: this.price4, city: this.cityA, location: this.loc2, timea: this.time3, timeb: this.time4};
        this.input5 = {price: this.price5, city: this.cityB, location: this.loc1, timea: this.time1, timeb: this.time2};
        this.input6 = {price: this.price6, city: this.cityB, location: this.loc1, timea: this.time3, timeb: this.time4}; 

        this.cityASchedule = [this.input1, this.input2, this.input3, this.input4];
        this.cityBSchedule = [this.input5, this.input6];
    }


  async createCityASchedule() {
      await this.setToll(this.input1);
      await this.setToll(this.input2);
      await this.setToll(this.input3);
      await this.setToll(this.input4);
  }

  async createCityBSchedule() {
      await this.setToll(this.input5);
      await this.setToll(this.input6);
  }

  async getToll(args) { //city: string, location: string, time: number) {
    var timepart = '';
    var locpart = '';
    if(args.location) locpart = `/${args.location}`;
    if(args.time) timepart = `/${args.time}`;
    else if(args.timea && args.timeb) timepart = `/${args.timea}/${args.timeb}`;
    var url = `${server}/get-toll/${args.city}${locpart}${timepart}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    
    return this.get(url);
  }

  async getTolls(args) { //city: string, location: string, time: number) {
    var timepart = '';
    var locpart = '';
    if(args.location) locpart = `/${args.location}`;
    if(args.time) timepart = `/${args.time}`;
    else if(args.timea && args.timeb) timepart = `/${args.timea}/${args.timeb}`;
    var url = `${server}/get-tolls/${args.city}${locpart}${timepart}`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
    return this.get(url);
  }


  async get(url) {
    //console.log(`getToll: url = ${url}`);
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


  async getTollCount() {
    var url = `${server}/get-toll-count`    // +'&auth_key='+process.env.YOURVOTECOUNTS_AUTH_KEY;
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

  async setToll(args) { //price: number, city: string, location: string, timea: number, timeb: number) {
    return this.post(`${server}/set-toll`, args);
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


  verifySetToll(expected: any /*{price: number, location: string, timea: number, timeb: number}*/,
                 actual: any,
                 marker: string) {
 
    var attrs = ['price', 'city', 'location', 'timea', 'timeb'];
    _.each(attrs, attr => {
        this.verifyValue(expected, actual, attr, marker); 
    })

  }

  verifyGetToll(expected: any, actual: any, marker: string) {
      // verify the 'result' attribute, a list of results
      expect(expected.length === actual['result'].length).toBeTruthy(`expected ${expected.length} record(s) in the result set but actually got ${actual['result'].length}  ${marker}`);  
      _.each(expected, exp => {
          var found = _.find(actual['result'], exp);
          expect(found).toBeTruthy(`expected to find ${JSON.stringify(expected)} in ${JSON.stringify(actual['result'])} `);	      
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

    if(expected['city']) this.verifyValue(expected, actual, 'city', marker); 
    if(expected['location']) this.verifyValue(expected, actual, 'location', marker); 
    if(expected['timea']) this.verifyValue(expected, actual, 'timea', marker); 
    if(expected['timeb']) this.verifyValue(expected, actual, 'timeb', marker); 
  }

  verifyLocation(expected: string, actual: string, marker: string) {
    //expect(expected+'' === actual+'').toBeTruthy(`expected location to be ${expected} but it was actually ${actual} ${marker}`);
    this.verifyValue({location: expected}, {location: actual}, 'location', marker); 
  }
}
