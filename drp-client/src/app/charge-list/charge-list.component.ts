import { Component, OnInit } from '@angular/core';
import { ChargeService } from '../charge.service';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {


  charges:{plate:string, city:string, location:string, time:number, price:number}[] = [];


  constructor(private chargeService: ChargeService) { }

  ngOnInit() {
      this.listenForCharges();
  }


  private listenForCharges() {
      let self = this;

      // see  TollListComponent.charged()
      // see  ChargeService.vehicleCharged()
      this.chargeService.listenForCharges().subscribe({
          next: function(value) {
              self.charges.push(value);
          },
          error: function(value) {
          },
          complete: function() {
          }
      }); 
  }

}
