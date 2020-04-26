import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { TollApi } from './api-toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The Toll API', () => {
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

  beforeEach(() => {
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);
  });


  it('should be able to SET, GET, then DELETE tolls', async () => {
    let price1 = 3.03; let price2 = 4.04;
    let location = '3 Elm Ln';
    let timea1 = 900; let timea2 = 1300;
    let timeb1 = 1300; let timeb2 = 1700;

    var actual;
    var exp1 = {price: price1, location: location, timea: timea1, timeb: timeb1};
    var exp2 = {price: price2, location: location, timea: timea2, timeb: timeb2};

    // test post 1
    actual = await tollApi.setToll(price1, location, timea1, timeb1);
    tollApi.verifyTollJson(exp1, actual['args'], '11111111111');

    // test post 2
    actual = await tollApi.setToll(price2, location, timea2, timeb2);
    tollApi.verifyTollJson(exp2, actual['args'], '222222222222');




    // VERIFY BY 3 QUERIES
    // query first time slot
    actual = await tollApi.getToll(location, 1100);
    tollApi.verifyPrice(price1, actual['price'], '33333333333'); 
    tollApi.verifyLocation(location, actual['args']['location'], '33333333333'); 

    // query second time slot
    actual = await tollApi.getToll(location, 1400);
    tollApi.verifyPrice(price2, actual['price'], '4444444444');

    // query outside both time slots
    actual = await tollApi.getToll(location, 1900);
    tollApi.verifyPrice(0, actual['price'], '55555555555');




    // test delete (all tolls for a location)
    actual = await tollApi.deleteTolls({location: location});
    //console.log('actual = ', actual);
    tollApi.verifyDelete({location: location}, actual['args'], '6666666666');

    // test get/query 2 times (should return empty set)
    actual = await tollApi.getToll(location, 1100);
    tollApi.verifyPrice(0, actual['price'], '77777777');

    actual = await tollApi.getToll(location, 1400);
    tollApi.verifyPrice(0, actual['price'], '8888888888');

  });



  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
