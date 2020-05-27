import { browser, logging, element, by, protractor } from 'protractor';
//import { Api } from './api.po';
import { ChargeVehicleApi } from './charge-vehicle.po';
import { TollApi } from './toll.po';
//import { TestSupport } from './test-support.po';
import * as _ from 'lodash';
import * as moment from 'moment';

// These API tests primarily help us support the browser tests
// In order to have confidence in those browser tests, we have to be confident that
// the API calls are working correctly.  That's what these API tests are for.
describe('The ChargeVehicle API', () => {
  let chargeVehicleApi: ChargeVehicleApi;
  let tollApi: TollApi;
  //let api: Api;
  //let testSupport: TestSupport;

  beforeEach(async () => {
    chargeVehicleApi = new ChargeVehicleApi();
    tollApi = new TollApi();
    //api = new Api({user:apiUser});
    //testSupport = new TestSupport(api);

    // SET UP: HAVE TO CREATE A TOLL SCHEDULE
    await tollApi.createCityCSchedule();
  });


  // @see   https://github.com/bdunklau/drp-aws/wiki/TC-Charge-vehicle 
  it('should be able to charge a toll to a license plate', async () => { 
      var actual; 
      var tollSched = tollApi.cityCSchedule;
      // CREATE 3 CHARGES
      var balance:number = 0; 
      var thetime = chargeVehicleApi.getTime(tollSched[0]['timea'] + 1) // 1 min after time1 
      actual = await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSched[0]['city'], tollSched[0]['location'], thetime);
      chargeVehicleApi.verifyCharge({plate: chargeVehicleApi.plate1, 
				      city: tollSched[0]['city'], 
				      location: tollSched[0]['location'], 
				      time: thetime, 
				      price: tollSched[0]['price']}, 
				    actual['args'], 
				    '11111111111');
      
      balance += tollSched[0]['price'];
      chargeVehicleApi.verifyBalance({balance: balance}, actual['result'][0], '2222221111111');
  


      var thetime = chargeVehicleApi.getTime(tollSched[1]['timea'] + 1) // 1 min after time1 
      actual = await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSched[1]['city'], tollSched[1]['location'], thetime);
      chargeVehicleApi.verifyCharge({plate: chargeVehicleApi.plate1, 
				      city: tollSched[1]['city'], 
				      location: tollSched[1]['location'], 
				      time: thetime, 
				      price: tollSched[1]['price']}, 
				    actual['args'], 
				    '33333333333333');
      
      balance += tollSched[1]['price'];
      chargeVehicleApi.verifyBalance({balance: balance}, actual['result'][0], '444444444444');



      var thetime = chargeVehicleApi.getTime(tollSched[2]['timea'] + 1) // 1 min after time1 
      actual = await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSched[2]['city'], tollSched[2]['location'], thetime);
      chargeVehicleApi.verifyCharge({plate: chargeVehicleApi.plate1, 
				      city: tollSched[2]['city'], 
				      location: tollSched[2]['location'], 
				      time: thetime, 
				      price: tollSched[2]['price']}, 
				    actual['args'], 
				    '555555555555');
      
      balance += tollSched[2]['price'];
      chargeVehicleApi.verifyBalance({balance: balance}, actual['result'][0], '66666666666');





      // DELETE THE CAR CHARGES
      actual = await chargeVehicleApi.deleteVehicleCharges({plate: chargeVehicleApi.plate1});
  })



  afterEach(async () => {
      await tollApi.deleteTolls({location: tollApi.loc1});

      // Assert that there are no errors emitted from the browser
      const logs = await browser.manage().logs().get(logging.Type.BROWSER);
      expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry));
  });

});
