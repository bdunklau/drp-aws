import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { Charge } from '../charge/charge.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-charge-form',
  templateUrl: './charge-form.component.html',
  styleUrls: ['./charge-form.component.css']
})
export class ChargeFormComponent implements OnInit {

  charge = new Charge('^^plate9^^', 'NYC', '100 5th Ave', 0);
  city:string;
  plate:string;
  londonTime:string;
  eastern:string;
  gmt:string;
  currTime:number;
  format:string = 'MMM D YYYY, h:mm:ss a';

  time:number;
  zone:string;
  yearValue:number;
  monthValue:number;
  dayValue:number;
  hourValue:number;
  minuteValue:number;
  secondValue:number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.setNow();
  }

  onSubmit(form) {

  }


  setTime(field, value) {
    this.currTime = moment(this.currTime).add(value, field).valueOf();
    this.updateTimes();
    this.addTimeToRoute(this.currTime);
  }

  private updateTimes() {
    this.gmt = moment(this.currTime).utc().format(this.format);
    this.londonTime = moment(this.currTime).tz('Europe/London').format(this.format);
    this.eastern = moment(this.currTime).tz('America/New_York').format(this.format);
  }

  setNow() {
    this.currTime = moment().valueOf();
    this.updateTimes();
    this.addTimeToRoute(this.currTime);
  }

  setCity(city:string) {
    this.city = city;
    this.router.navigate(['/charge', {city:city}]);
  }

  setPlate(plate:string) {
    this.plate = plate;
  }

  private addTimeToRoute(time:number) {
    let args:any = {time:time};
    if(this.city) args['city'] = this.city;
    this.router.navigate(['/charge', args]);
  }

}
