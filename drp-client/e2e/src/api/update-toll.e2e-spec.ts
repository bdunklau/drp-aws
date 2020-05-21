import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { TollApi } from './toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The update-toll API', () => {
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

  /*******************
    let price1 = 303; let price2 = 404; let price3 = 505; let price4 = 606; let price5 = 707; let price6 = 808;
    let cityA = 'CityE'; let cityB = 'CityF';
    let loc1 = '111 XXX Ln'; let loc2 = '222 XXX Ln';
    let time1 = 900; let time2 = 1300;
    let time3 = 1300; let time4 = 1700;

    var actual;
    var input1;
    var input2;
    var input3;
    var input4;
    var input5;
    var input6;
   	*************/


  beforeEach(async () => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
    /************
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
        *************/

       await tollApi.createCityASchedule();
       await tollApi.createCityBSchedule();
  });



  // @see   https://github.com/bdunklau/drp-aws/wiki/TC-Update-toll-in-a-city-at-a-location-and-time 
  it('should be able to UPDATE a toll', async () => {
    var actual;

    // update 1 toll
    var modified1 = tollApi.input1;
    modified1['price'] = 999;
    actual = await tollApi.setToll(modified1); // 'set' and 'update' are the same thing thanks to 'upsert:true'
    tollApi.verifySetToll(modified1, actual['args'], 'update toll: 1111111');

    // verify by query
    actual = await tollApi.getToll(modified1);
    tollApi.verifyGetToll([modified1], actual, 'update toll: 222222');
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
