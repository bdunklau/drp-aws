import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { TollApi } from './toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The set-toll API', () => {
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

  beforeEach(() => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
  });



  // @see  https://github.com/bdunklau/drp-aws/wiki/TC-Set-toll-in-city-at-location-between-two-times
  it('should be able to SET tolls', async () => {
    let price1 = 303;
    let cityA = 'CityA';
    let loc1 = '3 Elm Ln';
    let time1 = 900; let time2 = 1300;

    var actual;
    var input1 = {price: price1, city: cityA, location: loc1, timea: time1, timeb: time2};

    // test post
    actual = await tollApi.setToll(input1);
    tollApi.verifySetToll(input1, actual['args'], '11111111111');

    // Query for toll using: CityA, 3 Elm Ln from 900 to 1300
    actual = await tollApi.getToll(input1);
    tollApi.verifyGetToll([input1], actual, 'verifyGetToll: 11111');
    tollApi.verifyPrice(input1.price, actual.price, 'verifyPrice: 1111');

    // delete all tolls in the city
    actual = await tollApi.deleteTolls({city: cityA});
    tollApi.verifyDelete({city:cityA}, actual['args'], '6666666666');
    
  })


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
