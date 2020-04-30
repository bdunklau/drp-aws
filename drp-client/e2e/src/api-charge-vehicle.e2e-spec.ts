import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { ChargeVehicleApi } from './api-charge-vehicle.po';
import { TollApi } from './api-toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
import * as moment from 'moment';

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
    let plate = 'SSS1234';
    let plate2 = 'PLATE2';

    var actual;

    // simulate different "current" times
    var d1 = moment().set('hour', 9).set('minute', 0).valueOf();  // 9am today
    var d2 = moment().set('hour', 11).set('minute', 0).valueOf();  // 11am today
    var d3 = moment().set('hour', 9).set('minute', 0).subtract(1, 'days').valueOf();  // 9am yesterday
    var d4 = moment().set('hour', 11).set('minute', 0).subtract(1, 'days').valueOf();  // 11am yesterday


    // CREATE 4 CHARGES
    actual = await chargeVehicleApi.chargeVehicle(plate, loc1, d1);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc1, time: d1, price: 1.09}, actual['args'], '11111111111');

    actual = await chargeVehicleApi.chargeVehicle(plate, loc1, d2);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc1, time: d2, price: 2.09}, actual['args'], '222222222');

    actual = await chargeVehicleApi.chargeVehicle(plate, loc2, d3);
    chargeVehicleApi.verifyCharge({plate: plate, location: loc2, time: d3, price: 3.09}, actual['args'], '33333333333');

    actual = await chargeVehicleApi.chargeVehicle(plate2, loc2, d4);
    chargeVehicleApi.verifyCharge({plate: plate2, location: loc2, time: d4, price: 4.09}, actual['args'], '4444444444'); // PLATE2


    // QUERY BY PLATE
    actual = await chargeVehicleApi.getVehicleCharges({plate: plate});
    chargeVehicleApi.verifyCharges([
	    		          {plate: plate, location: loc1, time: d1, price: 1.09},
	    		          {plate: plate, location: loc1, time: d2, price: 2.09},
	    		          {plate: plate, location: loc2, time: d3, price: 3.09}
    				], 
			       actual['result'], '5555555555');

    // QUERY BY PLATE SINCE DATE
    actual = await chargeVehicleApi.getVehicleCharges({plate: plate, time1: (d1-1000)});
    chargeVehicleApi.verifyCharges([
	    		          {plate: plate, location: loc1, time: d1, price: 1.09},
	    		          {plate: plate, location: loc1, time: d2, price: 2.09}
    				], 
			       actual['result'], '6666666666666');


    // QUERY BY PLATE UNTIL DATE
    actual = await chargeVehicleApi.getVehicleCharges({plate: plate, time2: (d1-1000)});
    chargeVehicleApi.verifyCharges([
	    		          {plate: plate, location: loc2, time: d3, price: 3.09}
    				], 
			       actual['result'], '7777777777');

    // QUERY BY PLATE OVER DATE RANGE
    actual = await chargeVehicleApi.getVehicleCharges({plate: plate, time1: (d3+1000), time2: (d1+1000)});
    chargeVehicleApi.verifyCharges([
	    		          {plate: plate, location: loc1, time: d1, price: 1.09}
    				], 
			       actual['result'], '8888888');


    // QUERY BY PLATE2
    actual = await chargeVehicleApi.getVehicleCharges({plate: plate2});
    chargeVehicleApi.verifyCharges([
	    		          {plate: plate2, location: loc2, time: d4, price: 4.09}
    				], 
			       actual['result'], '999999999999');


    // DELETE THE CAR CHARGES
    actual = await chargeVehicleApi.deleteVehicleCharges({plate: plate});
    actual = await chargeVehicleApi.deleteVehicleCharges({plate: plate2});

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
