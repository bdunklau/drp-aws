import { Injectable } from '@angular/core';
import { Toll } from './toll/toll.model';
import { Charge } from './charge/charge.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import * as _ from 'lodash';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  city:string;  // set by ChargeFormComponent.setCity()
  zone:number;  // set by ChargeFormComponent.setCity()
  plate:string; // set by ChargeFormComponent.setPlate()
  time:number;  // set by ChargeFormComponent.updateTimes() 
  private vehicle_charged = new Subject<{plate:string, city:string, location:string, time:number, zone:number, price:number, balance:number}>();

  constructor(public http: HttpClient) { }


  // called by TollListComponent.charge()
  chargeThis(toll: Toll, zone:number) {
    let ready:boolean = this.city && this.plate && this.time && this.zone ? true : false;
    if(!ready) return Observable.of(false);
    let charge:Charge = new Charge(this.plate, this.city, toll.location, this.time, this.zone);
    
    return this.http.post('/drpapi/charge-vehicle', charge);
  }



  // WHAT CALLS THIS FUNCTION:  TollListComponent.charge()
  // vehicleCharge is vehicleCharge from:
  // https://github.com/bdunklau/drp-aws/blob/master/drp-server/services/chargeVehicleService.js
  // function:  chargeVehicle()
  vehicleCharged(data) {
      let vehicleCharge = data['args'];
      let balance = data['result'][0]['balance']
      this.vehicle_charged.next({plate:vehicleCharge['plate'],
                                 city:vehicleCharge['city'],
                                 location:vehicleCharge['location'],
                                 time:vehicleCharge['time'],
                                 zone:vehicleCharge['zone'],
                                 price:vehicleCharge['price'],
                                 balance:balance});
  } 


  // see  ChargeListComponent
  listenForCharges() {
      return this.vehicle_charged;
  }


//  {"_id":"5ede8a7cdb0e841f5daadc72",
// "plate":"LIC PLT 1",
// "city":"NYC",
// "price":1400,
// "location":"1",
// "time":1591642743691,
// "date":"Mon, Jun 8th 2020, 6:59:03 pm",
// "millis":1591642743691}
  getCharges(criteria): Observable<{plate:string, city:string, price:number, location:string, time:number}[]> {
    let charges = [];
    return this.http.get(`/drpapi/get-vehicle-charges/${criteria['plate']}`).pipe(
        map(res => {
            _.each(res['result'], charge => {
               charges.push(charge)
           })   
           return charges; 
        })
    )
    
  }


  // "number" is the number of charges that were deleted
  deleteCharges(plate:string): Observable<number> {
    return this.http.post(`/drpapi/delete-vehicle-charges`, {plate: plate}).pipe(
        map(res => {
           let numDeleted = res['result']; 
           return numDeleted
        })
    )
  }


  getBalance(criteria): Observable<number> {
      return this.http.get(`/drpapi/get-vehicle-balance/${criteria['plate']}`).pipe(
          map(res => {
              return res['result']['balance'];
          })
      )
  }

 
}
