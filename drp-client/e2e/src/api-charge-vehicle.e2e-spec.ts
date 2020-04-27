import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { ChargeVehicleApi } from './api-charge-vehicle.po';
import { TollApi } from './api-toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
//import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The ChargeVehicle API', () => {
  let chargeVehicleApi: ChargeVehicleApi;
  let tollApi: TollApi;
  let toll1: any;
  let toll2: any;
  let toll3: any;
  let toll4: any;
  let loc1 = '66 Main St';
  let loc2 = '77 Main St';
  //let api: Api;
  //let testSupport: TestSupport;

  beforeEach(async () => {
    chargeVehicleApi = new ChargeVehicleApi();
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);

    // SET UP: HAVE TO CREATE A TOLL SCHEDULE
    toll1 = await tollApi.setToll(1.09, loc1, 800, 1000);
    toll2 = await tollApi.setToll(2.09, loc1, 1000, 1200);
    toll3 = await tollApi.setToll(3.09, loc2, 800, 1000);
    toll4 = await tollApi.setToll(4.09, loc2, 1000, 1200);
  });


  it('should be able to charge a toll to a license plate', async () => {
    let plate = 'SSS 1234';
    //let time1 = 1100;
    //let time2 = 1400;

    var actual;

    actual = await chargeVehicleApi.chargeVehicle(plate, loc1, 900);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc1, time: 900, price: 1.09}, actual['args'], '11111111111');

    actual = await chargeVehicleApi.chargeVehicle(plate, loc1, 1100);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc1, time: 1100, price: 2.09}, actual['args'], '222222222');

    actual = await chargeVehicleApi.chargeVehicle(plate, loc2, 900);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc2, time: 900, price: 3.09}, actual['args'], '33333333333');

    actual = await chargeVehicleApi.chargeVehicle(plate, loc2, 1100);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc2, time: 1100, price: 4.09}, actual['args'], '4444444444');


    // BELOW, IN afterEach(), NEED TO ALSO DELETE THE CAR CHARGES.  WILL MESS UP THE BALANCE FIGURING IF NOT DELETED


    /****************
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
     ***********/

  });



  afterEach(async () => {
    await tollApi.deleteTolls({location: loc1});
    await tollApi.deleteTolls({location: loc2});

    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
