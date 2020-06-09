import { Component, OnInit } from '@angular/core';
import { ChargeService } from '../charge.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {

  plate: string;
  zone: string;
  balance: number;
  charges:{plate:string, city:string, price:number, location:string, time:number}[] = [];


  constructor(private chargeService: ChargeService,
              private route: ActivatedRoute) { }

  ngOnInit() {
      let self = this;
      this.route.paramMap.subscribe((params:ParamMap) => {
          let criteria:any = {};
          if(params.get('plate')) {
              criteria['plate'] = params.get('plate');
              self.plate = params.get('plate');
          }
          if(params.get('zone')) {
              self.zone = params.get('zone');
          }
          if(Object.keys(criteria).length == 0) return;
          self.queryForCharges(criteria);
          self.queryForBalance(criteria);
      });
      this.listenForCharges();
  }


  private listenForCharges() {
      let self = this;

      // see  TollListComponent.charged()
      // see  ChargeService.vehicleCharged()
      this.chargeService.listenForCharges().subscribe({
          next: function(value) {
              self.charges.push(value);
              self.balance = value['balance'];
          },
          error: function(value) {
          },
          complete: function() {
          }
      }); 
  }


  queryForCharges(criteria) {
      this.chargeService.getCharges(criteria)
          .subscribe(data => this.charges = data);
  }


  queryForBalance(criteria) {
      this.chargeService.getBalance(criteria).subscribe(data => {
          console.log('data = ', data);
          this.balance = data
      })
  }


  deleteCharges(plate:string) {
      this.chargeService.deleteCharges(plate).subscribe(data => {
          this.balance = 0;
          this.charges = [];
      })
  }

}
