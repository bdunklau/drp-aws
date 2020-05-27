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
describe('The get-vehicle-charges API', () => {
  let chargeVehicleApi: ChargeVehicleApi;
  let tollApi: TollApi;
  let tollSchedA;
  let tollSchedB;
  let tollSchedC;
  let time1;
  let time2;
  let time3;
  let time4;
  let time5;
  let times;

  //let api: Api;
  //let testSupport: TestSupport;

  beforeEach(async () => {
      chargeVehicleApi = new ChargeVehicleApi();
      tollApi = new TollApi();
      //api = new Api({user:apiUser});
      //testSupport = new TestSupport(api);

      // SET UP: HAVE TO CREATE A TOLL SCHEDULE
      await tollApi.createCityASchedule();
      await tollApi.createCityBSchedule();
      await tollApi.createCityCSchedule();

      tollSchedA = tollApi.cityASchedule;
      tollSchedB = tollApi.cityBSchedule;
      tollSchedC = tollApi.cityCSchedule;
    
      time1 = chargeVehicleApi.getTime(tollSchedA[0]['timea'] + 1) // 1 min after time1
      time2 = chargeVehicleApi.getTime(tollSchedA[1]['timea'] + 1) // 1 min after time1 
      time3 = chargeVehicleApi.getTime(tollSchedA[2]['timea'] + 1) // 1 min after time1 
      times = [time1, time2, time3];

      // PLATE1 - CITYA CHARGES
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSchedA[0]['city'], tollSchedA[0]['location'], time1);

      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSchedA[1]['city'], tollSchedA[1]['location'], time2);
      
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSchedA[2]['city'], tollSchedA[2]['location'], time3);
     
      
      // PLATE1 - CITYC CHARGES
      time4 = chargeVehicleApi.getTime(tollSchedC[0]['timea'] + 1) // 1 min after time1 
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSchedC[0]['city'], tollSchedC[0]['location'], time4);

      time5 = chargeVehicleApi.getTime(tollSchedC[1]['timea'] + 1) // 1 min after time1 
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate1, tollSchedC[1]['city'], tollSchedC[1]['location'], time5);



      // PLATE2 - CITYA CHARGES
      var thetime = chargeVehicleApi.getTime(tollSchedA[0]['timea'] + 1) // 1 min after time1 
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate2, tollSchedA[0]['city'], tollSchedA[0]['location'], thetime);

      thetime = chargeVehicleApi.getTime(tollSchedA[1]['timea'] + 1) // 1 min after time1 
      await chargeVehicleApi.chargeVehicle(chargeVehicleApi.plate2, tollSchedA[1]['city'], tollSchedA[1]['location'], thetime);
  });


  // @see    https://github.com/bdunklau/drp-aws/wiki/TC-Get-vehicle-charges-for-a-plate#test
  it('should be able to get all charges for a plate', async () => { 
       var actual = await chargeVehicleApi.getVehicleChargesByPlate( chargeVehicleApi.plate1 ); 
       var expected = [
           {plate: chargeVehicleApi.plate1, city: tollSchedA[0]['city'], location: tollSchedA[0]['location'], time: time1, price: tollSchedA[0]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedA[1]['city'], location: tollSchedA[1]['location'], time: time2, price: tollSchedA[1]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedA[2]['city'], location: tollSchedA[2]['location'], time: time3, price: tollSchedA[2]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedC[0]['city'], location: tollSchedC[0]['location'], time: time4, price: tollSchedC[0]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedC[1]['city'], location: tollSchedC[1]['location'], time: time5, price: tollSchedC[1]['price']}
       ];
       chargeVehicleApi.verifyCharges(expected, actual['result'], 'verify charges: 111111111');
  })


  // @see    https://github.com/bdunklau/drp-aws/wiki/TC-Get-vehicle-charges-for-a-plate#test-1
  it('should be able to get all charges for a plate in a city', async () => { 
       var actual = await chargeVehicleApi.getVehicleChargesByPlateAndCity( chargeVehicleApi.plate1, tollSchedA[0]['city'] ); 
       var expected = [
           {plate: chargeVehicleApi.plate1, city: tollSchedA[0]['city'], location: tollSchedA[0]['location'], time: time1, price: tollSchedA[0]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedA[1]['city'], location: tollSchedA[1]['location'], time: time2, price: tollSchedA[1]['price']},
           {plate: chargeVehicleApi.plate1, city: tollSchedA[2]['city'], location: tollSchedA[2]['location'], time: time3, price: tollSchedA[2]['price']}
       ];
       chargeVehicleApi.verifyCharges(expected, actual['result'], 'verify charges: 22222222');
  })



  // @see    https://github.com/bdunklau/drp-aws/wiki/TC-Get-vehicle-charges-for-a-plate#test-2
  it('should be able to get all charges for a plate since a date', async () => { 
      var thetime = chargeVehicleApi.getTime(tollSchedA[0]['timea'] + 5) // 5 mins after time1 
      var actual = await chargeVehicleApi.getVehicleChargesByPlateSinceDate( chargeVehicleApi.plate1, thetime ); 
      var expected = [
          {plate: chargeVehicleApi.plate1, city: tollSchedA[1]['city'], location: tollSchedA[1]['location'], time: time2, price: tollSchedA[1]['price']},
          {plate: chargeVehicleApi.plate1, city: tollSchedC[1]['city'], location: tollSchedC[1]['location'], time: time5, price: tollSchedC[1]['price']}
      ];
      chargeVehicleApi.verifyCharges(expected, actual['result'], 'verify charges: 33333333');
  })


  // @see    https://github.com/bdunklau/drp-aws/wiki/TC-Get-vehicle-charges-for-a-plate#test-3
  it('should be able to get all charges for a plate until a date', async () => { 
      var thetime = chargeVehicleApi.getTime(tollSchedA[0]['timea'] + 5) // 5 mins after time1 
      var actual = await chargeVehicleApi.getVehicleChargesByPlateUntilDate( chargeVehicleApi.plate1, thetime ); 
      var expected = [
          {plate: chargeVehicleApi.plate1, city: tollSchedA[0]['city'], location: tollSchedA[0]['location'], time: time1, price: tollSchedA[0]['price']},
          {plate: chargeVehicleApi.plate1, city: tollSchedA[2]['city'], location: tollSchedA[2]['location'], time: time3, price: tollSchedA[2]['price']},
          {plate: chargeVehicleApi.plate1, city: tollSchedC[0]['city'], location: tollSchedC[0]['location'], time: time4, price: tollSchedC[0]['price']}
      ];
      chargeVehicleApi.verifyCharges(expected, actual['result'], 'verify charges: 4444444444');
  })


  // @see    https://github.com/bdunklau/drp-aws/wiki/TC-Get-vehicle-charges-for-a-plate#test-4
  it('should be able to get all charges for a plate between 2 dates', async () => { 
      var timea = chargeVehicleApi.getTime(tollSchedA[0]['timea'] + 5) // 5 mins after time1 
      var timeb = chargeVehicleApi.getTime(tollSchedA[1]['timeb'] - 5) // 5 mins before time2 
      var actual = await chargeVehicleApi.getVehicleChargesByPlateBetweenTwoDates( chargeVehicleApi.plate1, timea, timeb ); 
      var expected = [
          {plate: chargeVehicleApi.plate1, city: tollSchedA[1]['city'], location: tollSchedA[1]['location'], time: time2, price: tollSchedA[1]['price']},
          {plate: chargeVehicleApi.plate1, city: tollSchedC[1]['city'], location: tollSchedC[1]['location'], time: time5, price: tollSchedC[1]['price']}
      ];
      chargeVehicleApi.verifyCharges(expected, actual['result'], 'verify charges: 555555555');
  })


  afterEach(async () => {
      // DELETE THE CAR CHARGES
      await chargeVehicleApi.deleteVehicleCharges({plate: chargeVehicleApi.plate1});

      await tollApi.deleteTolls({location: tollApi.loc1});

      // Assert that there are no errors emitted from the browser
      const logs = await browser.manage().logs().get(logging.Type.BROWSER);
      expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry));
  });
});
