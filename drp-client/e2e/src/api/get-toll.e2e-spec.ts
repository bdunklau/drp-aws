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


  beforeEach(async () => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
    await tollApi.createCityASchedule();
    await tollApi.createCityBSchedule();
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-toll-in-city-at-location-at-a-time
  it('should be able to GET a toll in a city at a location at a time', async () => {
    var actual;

    // Query for toll
    let query5 = {city: tollApi.cityB, location: tollApi.loc1, time: tollApi.timestamp1};
    actual = await tollApi.getToll(query5);
    tollApi.verifyGetToll([tollApi.input5], actual, 'verifyGetToll: 11111');
    tollApi.verifyPrice(tollApi.input5.price, actual.price, 'verifyPrice: 1111');


    // Query for toll
    let query0 = {city: tollApi.cityB, location: tollApi.loc1, time: tollApi.timestamp2};
    actual = await tollApi.getToll(query0);
    tollApi.verifyGetToll([], actual, 'verifyGetToll: 222222');
    tollApi.verifyPrice(0, actual.price, 'verifyPrice: 22222');
    
  })

  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-toll-in-city-at-location-at-a-time
  it('should be able to GET a toll - exact match (city,location,time1,time2)', async () => {
    var actual;

    // Query for toll
    let query = {city: tollApi.cityBSchedule[1]['city'], 
	          location: tollApi.cityBSchedule[1]['location'], 
                  timea: tollApi.cityBSchedule[1]['timea'],
                  timeb: tollApi.cityBSchedule[1]['timeb']};
    actual = await tollApi.getToll(query);
    tollApi.verifyGetToll([tollApi.cityBSchedule[1]], actual, 'verifyGetToll: 777777777');
    tollApi.verifyPrice(tollApi.cityBSchedule[1]['price'], actual.price, 'verifyPrice: 88888888');
    
  })


  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-tolls-in-a-city
  it('should be able to GET tolls in a city', async () => {
      var actual;

      //query for tolls in cityA
      let queryA = {city: tollApi.cityA};
      actual = await tollApi.getTolls(queryA);
      tollApi.verifyGetToll(tollApi.cityASchedule, actual, 'verifyGetToll: 3333333');

      //query for tolls in cityB
      let queryB = {city: tollApi.cityB};
      actual = await tollApi.getTolls(queryB);
      tollApi.verifyGetToll(tollApi.cityBSchedule, actual, 'verifyGetToll: 44444444');

  })


  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-tolls-in-a-city-at-location
  it('should be able to GET tolls in a city at location', async () => {
      var actual;

      //query for tolls in cityA
      let queryA = {city: tollApi.cityA, location: tollApi.loc1};
      actual = await tollApi.getTolls(queryA);
      tollApi.verifyGetToll([tollApi.input1, tollApi.input2], actual, 'verifyGetToll: 555555555');

      //query for tolls in cityB
      let queryB = {city: tollApi.cityB, location: tollApi.loc1};
      actual = await tollApi.getTolls(queryB);
      tollApi.verifyGetToll([tollApi.input5, tollApi.input6], actual, 'verifyGetToll: 666666');

  })


  afterEach(async () => {
    await tollApi.deleteTolls({city: tollApi.cityA});
    await tollApi.deleteTolls({city: tollApi.cityB});

    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
