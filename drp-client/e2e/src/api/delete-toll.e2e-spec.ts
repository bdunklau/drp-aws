import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { TollApi } from './toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The delete-toll API', () => {
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

    let price1 = 303; let price2 = 404; let price3 = 505; let price4 = 606; let price5 = 707; let price6 = 808;
    let cityA = 'CityC'; let cityB = 'CityD';
    let loc1 = '100 X Ln'; let loc2 = '200 X Ln';
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

      actual = await tollApi.getTolls({city: cityA});
      tollApi.verifyGetToll([input1, input2, input3, input4], actual, 'beforeEach: 1111111');

      actual = await tollApi.getTolls({city: cityB});
      tollApi.verifyGetToll([input5, input6], actual, 'beforeEach: 222222');
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Delete-all-tolls-in-a-city
  it('should be able to DELETE tolls in a city', async () => {
      actual = await tollApi.deleteTolls({city: cityA});
      tollApi.verifyDelete({city: cityA}, actual['args'], 'verifyDelete: 1111111');

      actual = await tollApi.getTolls({city: cityA});
      tollApi.verifyGetToll([], actual, 'verifyDelete: 222222');

      actual = await tollApi.getTolls({city: cityB});
      tollApi.verifyGetToll([input5, input6], actual, 'verifyDelete: 333333333');
  })


  // @see https://github.com/bdunklau/drp-aws/wiki/TC-Delete-all-tolls-in-a-city-at-a-location
  it('should be able to DELETE tolls in a city at a location', async () => {
      actual = await tollApi.deleteTolls({city: cityA, location: loc1});
      tollApi.verifyDelete({city: cityA, location: loc1}, actual['args'], 'verifyDelete: 4444444');

      actual = await tollApi.getTolls({city: cityA});
      tollApi.verifyGetToll([input3, input4], actual, 'verifyDelete: 555555555');

      actual = await tollApi.getTolls({city: cityB});
      tollApi.verifyGetToll([input5, input6], actual, 'verifyDelete: 666666666');
  })

  
  it('should be able to DELETE tolls in a city at a location and time', async () => {
      actual = await tollApi.deleteTolls({city: cityA, location: loc1, timea: time3, timeb: time4});
      tollApi.verifyDelete({city: cityA, location: loc1, timea: time3, timeb: time4}, actual['args'], 'verifyDelete: 777777');

      actual = await tollApi.getTolls({city: cityA});
      tollApi.verifyGetToll([input1, input3, input4], actual, 'verifyDelete: 555555555');

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