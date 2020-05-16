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

  beforeEach(() => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Get-toll-in-city-at-location-at-a-time
  it('should be able to GET tolls', async () => {
    let price1 = 303; let price2 = 404; let price3 = 505; let price4 = 606; let price5 = 707; let price6 = 808;
    let cityA = 'CityA'; let cityB = 'CityB';
    let loc1 = '3 Elm Ln'; let loc2 = '505 Elm Ln';
    let time1 = 900; let time2 = 1300;
    let time3 = 1300; let time4 = 1700;
    let timestamp1 = 1465215250000;
    let timestamp2 = 1465195250000;

    var actual;
    var input1 = {price: price1, city: cityA, location: loc1, timea: time1, timeb: time2};
    var input2 = {price: price2, city: cityA, location: loc1, timea: time3, timeb: time4};
    var input3 = {price: price3, city: cityA, location: loc2, timea: time1, timeb: time2};
    var input4 = {price: price4, city: cityA, location: loc2, timea: time3, timeb: time4};
    var input5 = {price: price5, city: cityB, location: loc1, timea: time1, timeb: time2};
    var input6 = {price: price6, city: cityB, location: loc1, timea: time3, timeb: time4};


    // test post
    actual = await tollApi.setToll(input1);
    tollApi.verifySetToll(input1, actual['args'], '11111111111');

    // test post
    actual = await tollApi.setToll(input2);
    tollApi.verifySetToll(input2, actual['args'], '2222222222');

    // test post
    actual = await tollApi.setToll(input3);
    tollApi.verifySetToll(input3, actual['args'], '33333333333');

    // test post
    actual = await tollApi.setToll(input4);
    tollApi.verifySetToll(input4, actual['args'], '4444444444');

    // test post
    actual = await tollApi.setToll(input5);
    tollApi.verifySetToll(input5, actual['args'], '5555555555');

    // test post
    actual = await tollApi.setToll(input6);
    tollApi.verifySetToll(input6, actual['args'], '666666666');


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


    actual = await tollApi.deleteTolls({city: cityA});
    tollApi.verifyDelete({city:cityA}, actual['args'], '6666666666');

    actual = await tollApi.deleteTolls({city: cityB});
    tollApi.verifyDelete({city:cityB}, actual['args'], '77777777');
    
  })



  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
