import { Injectable } from '@angular/core';
import { Toll } from './toll/toll.model';
import { Charge } from './charge/charge.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  city:string;  // set by ChargeFormComponent.setCity()
  zone:string;  // set by ChargeFormComponent.setCity()
  plate:string; // set by ChargeFormComponent.setPlate()
  time:number;  // set by ChargeFormComponent.updateTimes() 
  private vehicle_charged = new Subject<{plate:string, city:string, location:string, time:number, price:number}>();

  constructor(public http: HttpClient) { }


  // called by TollListComponent.charge()
  chargeThis(toll: Toll) {
    let ready:boolean = this.city && this.plate && this.time ? true : false;
    if(!ready) return Observable.of(false);
    let charge:Charge = new Charge(this.plate, this.city, toll.location, this.time, this.zone);
    
    return this.http.post('/drpapi/charge-vehicle', charge);
  }


  // vehicleCharge is vehicleCharge from:
  // https://github.com/bdunklau/drp-aws/blob/master/drp-server/services/chargeVehicleService.js
  // function:  chargeVehicle()
  vehicleCharged(vehicleCharge) {
      this.vehicle_charged.next({plate:vehicleCharge['plate'],
                                 city:vehicleCharge['city'],
                                 location:vehicleCharge['location'],
                                 time:vehicleCharge['time'],
                                 zone:vehicleCharge['zone'],
                                 price:vehicleCharge['price']});
  } 


  // see  ChargeListComponent
  listenForCharges() {
      return this.vehicle_charged;
  } 
}
