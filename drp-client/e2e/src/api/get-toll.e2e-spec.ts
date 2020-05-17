import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { TollApi } from './toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The get-toll API', () => {
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

    let price1 = 303; let price2 = 404; let price3 = 505; let price4 = 606; let price5 = 707; let price6 = 808;
    let cityA = 'CityA'; let cityB = 'CityB';
    let loc1 = '3 Elm Ln'; let loc2 = '505 Elm Ln';
    let time1 = 900; let time2 = 1300;
    let time3 = 1300; let time4 = 1700;
    let timestamp1 = 1465215250000;
    let timestamp2 = 1465195250000;

    var actual;
    var input1;
    var input2;
    var input3;
    var input4;
    var input5;
    var input6;


  beforeEach(async () => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
    input1 = {price: price1, city: cityA, location: loc1, timea: time1, timeb: time2};
    input2 = {price: price2, city: cityA, location: loc1, timea: time3, timeb: time4};
    input3 = {price: price3, city: cityA, location: loc2, timea: time1, timeb: time2};
    input4 = {price: price4, city: cityA, location: loc2, timea: time3, timeb: time4};
    input5 = {price: price5, city: cityB, location: loc1, timea: time1, timeb: time2};
    input6 = {price: price6, city: cityB, location: loc1, timea: time3, timeb: time4};

    await tollApi.setToll(input1);
    await tollApi.setToll(input2);
    await tollApi.setToll(input3);
    await tollApi.setToll(input4);
    await tollApi.setToll(input5);
    await tollApi.setToll(input6);
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-toll-in-city-at-location-at-a-time
  it('should be able to GET a toll', async () => {
    var actual;

    // Query for toll
    let query5 = {city: cityB, location: loc1, time: timestamp1};
    actual = await tollApi.getToll(query5);
    tollApi.verifyGetToll([input5], actual, 'verifyGetToll: 11111');
    tollApi.verifyPrice(input5.price, actual.price, 'verifyPrice: 1111');


    // Query for toll
    let query0 = {city: cityB, location: loc1, time: timestamp2};
    actual = await tollApi.getToll(query0);
    tollApi.verifyGetToll([], actual, 'verifyGetToll: 222222');
    tollApi.verifyPrice(0, actual.price, 'verifyPrice: 22222');
    
  })


  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-tolls-in-a-city
  it('should be able to GET tolls in a city', async () => {
      var actual;

      //query for tolls in cityA
      let queryA = {city: cityA};
      actual = await tollApi.getTolls(queryA);
      tollApi.verifyGetToll([input1, input2, input3, input4], actual, 'verifyGetToll: 3333333');

      //query for tolls in cityB
      let queryB = {city: cityB};
      actual = await tollApi.getTolls(queryB);
      tollApi.verifyGetToll([input5, input6], actual, 'verifyGetToll: 44444444');

  })


  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-tolls-in-a-city-at-location
  it('should be able to GET tolls in a city at location', async () => {
      var actual;

      //query for tolls in cityA
      let queryA = {city: cityA, location: loc1};
      actual = await tollApi.getTolls(queryA);
      tollApi.verifyGetToll([input1, input2], actual, 'verifyGetToll: 555555555');

      //query for tolls in cityB
      let queryB = {city: cityB, location: loc1};
      actual = await tollApi.getTolls(queryB);
      tollApi.verifyGetToll([input5, input6], actual, 'verifyGetToll: 666666');

  })


  afterEach(async () => {
    await tollApi.deleteTolls({city: cityA});
    await tollApi.deleteTolls({city: cityB});

    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
