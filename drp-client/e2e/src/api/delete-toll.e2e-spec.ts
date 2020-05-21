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


  beforeEach(async () => {
      tollApi = new TollApi();
      //api = new Api({user:apiUser});
      //testSupport = new TestSupport(api);


      await tollApi.createCityASchedule();
      await tollApi.createCityBSchedule();

      var actual;

      actual = await tollApi.getTolls({city: tollApi.cityA});
      tollApi.verifyGetToll(tollApi.cityASchedule, actual, 'beforeEach: 1111111');

      actual = await tollApi.getTolls({city: tollApi.cityB});
      tollApi.verifyGetToll(tollApi.cityBSchedule, actual, 'beforeEach: 222222');
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Delete-all-tolls-in-a-city
 it('should be able to DELETE tolls in a city', async () => {
      var actual;
      actual = await tollApi.deleteTolls({city: tollApi.cityA});
      tollApi.verifyDelete({city: tollApi.cityA}, actual['args'], 'verifyDelete: 1111111');

      actual = await tollApi.getTolls({city: tollApi.cityA});
      tollApi.verifyGetToll([], actual, 'verifyDelete: 222222');

      actual = await tollApi.getTolls({city: tollApi.cityB});
      tollApi.verifyGetToll(tollApi.cityBSchedule, actual, 'verifyDelete: 33333333');
  })


  // @see https://github.com/bdunklau/drp-aws/wiki/TC-Delete-all-tolls-in-a-city-at-a-location
  it('should be able to DELETE tolls in a city at a location', async () => {
      var actual;
      actual = await tollApi.deleteTolls({city: tollApi.cityA, location: tollApi.loc1});
      tollApi.verifyDelete({city: tollApi.cityA, location: tollApi.loc1}, actual['args'], 'verifyDelete: 4444444');

      actual = await tollApi.getTolls({city: tollApi.cityA});
      tollApi.verifyGetToll([tollApi.input3, tollApi.input4], actual, 'verifyDelete: 555555555');

      actual = await tollApi.getTolls({city: tollApi.cityB});
      tollApi.verifyGetToll([tollApi.input5, tollApi.input6], actual, 'verifyDelete: 666666666');
  })

  
  it('should be able to DELETE tolls in a city at a location and time', async () => {
      var actual;
      actual = await tollApi.deleteTolls({city: tollApi.cityA, location: tollApi.loc1, timea: tollApi.time3, timeb: tollApi.time4});
      tollApi.verifyDelete({city: tollApi.cityA, location: tollApi.loc1, timea: tollApi.time3, timeb: tollApi.time4}, actual['args'], 'verifyDelete: 777777');

      actual = await tollApi.getTolls({city: tollApi.cityA});
      tollApi.verifyGetToll([tollApi.input1, tollApi.input3, tollApi.input4], actual, 'verifyDelete: 8888888888');

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
