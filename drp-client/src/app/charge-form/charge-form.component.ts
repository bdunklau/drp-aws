import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { Charge } from '../charge/charge.model';
import { Router } from '@angular/router';
import { ChargeService } from '../charge.service';

@Component({
  selector: 'app-charge-form',
  templateUrl: './charge-form.component.html',
  styleUrls: ['./charge-form.component.css']
})
export class ChargeFormComponent implements OnInit {

  charge = new Charge('^^plate9^^', 'NYC', '100 5th Ave', 0, -400);
  city:string;
  zone:string; //timezone offset, i.e. -0400 or 0100
  plate:string;
  londonTime:string;
  eastern:string;
  gmt:string;
  currTime:number;
  format:string = 'MMM D YYYY, h:mm:ss a';
  time:number;

  constructor(private router: Router,
              private chargeService: ChargeService) { }

  ngOnInit() {
    this.setNow();
  }


  setTime(field, value) {
    this.currTime = moment(this.currTime).add(value, field).valueOf();
    this.updateTimes();
    this.addTimeToRoute(this.currTime);
  }

  private updateTimes() {
    this.chargeService.time = this.currTime;
    this.gmt = moment(this.currTime).utc().format(this.format);
    this.londonTime = moment(this.currTime).tz('Europe/London').format(this.format);
    this.eastern = moment(this.currTime).tz('America/New_York').format(this.format);
  }

  setNow() {
    this.currTime = moment().valueOf();
    this.updateTimes();
    this.addTimeToRoute(this.currTime);
  }

  setCity(city:string, zone:string) {
    this.city = city;
    this.zone = zone;
    this.chargeService.city = city;
    this.chargeService.zone = parseInt(zone);
    this.router.navigate(['/charge', {city:city, zone:zone}]);
  }

  setPlate(plate:string) {
    this.chargeService.plate = plate;
    this.plate = plate;
    let args:any = {};
    if(this.city) args['city'] = this.city;
    if(this.plate) args['plate'] = this.plate;
    if(this.zone) args['zone'] = this.zone;
    if(this.currTime) args['time'] = this.currTime;
    this.router.navigate(['/charge', args]);
  }

  private addTimeToRoute(time:number) {
    let args:any = {time:time};
    if(this.city) args['city'] = this.city;
    if(this.plate) args['plate'] = this.plate;
    if(this.zone) args['zone'] = this.zone;
    this.router.navigate(['/charge', args]);
  }

}
