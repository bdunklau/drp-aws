import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { ChargeService } from '../charge.service';
import { Toll } from '../toll/toll.model';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-toll-list',
  templateUrl: './toll-list.component.html',
  styleUrls: ['./toll-list.component.css']
})
export class TollListComponent implements OnInit {

  city: string;
  time: number;
  zone: number;
  public tolls = [];
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faDollarSign = faDollarSign;

  constructor(private tollService:TollService,
             private chargeService: ChargeService,
	     private router: Router,
	     private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this;
    this.route.paramMap.subscribe((params: ParamMap) => {
        let criteria:any = {}
	if(params.get('city')) {
            criteria['city'] = params.get('city');
            self.city = params.get['city'];
        }
	if(params.get('time')) {
            criteria['time'] = parseInt(params.get('time'));
            self.time = criteria['time'];
        }
        if(params.get('zone')) {
            criteria['zone'] = parseInt(params.get('zone'));
            self.zone = criteria['zone'];
        }
        if(Object.keys(criteria).length == 0) return;
	self.query(criteria);
    }) 

    this.listenForTollsToBeAdded();
    this.listenForCity();
  }


  delete(toll) {
    this.tollService.deleteToll(toll).subscribe(data => {
        // now delete the toll from the html list
	_.remove(this.tolls, toll);
    })
  }


  onSelect(toll) {
    // NOTE:  the { and } means the url parameters are optional
    this.router.navigate(['/toll', 
	{city: toll.city, 
	 location: toll.location, 
	 timea: toll.timea, 
	 timeb: toll.timeb,
	 price: toll.price} ]);
  }


  charge(toll) {
    /************
    A toll has been selected from the list.  Now we need to send the city, location and price somewhere
    so the charge component can send it to the database
    *************/

    // modeled after TollComponent.onSubmit()
    this.chargeService.chargeThis(toll).subscribe(data => {
        if(!data || !data['args']) return;
        this.chargeService.vehicleCharged(data['args'])
    });
  }


  listenForTollsToBeAdded() {
    let self = this;
    var observer = {
        next: function(value) {
	    var found = _.find(self.tolls, {city: value['city'], location: value['location'], timea: value['timea'], timeb: value['timeb']});
	    if(found) found['price'] = value['price'];
	    else self.tolls.push(value);
	},
	error: function(value) {
	},
	complete: function() {}
    }

    //see   2:35 of https://www.youtube.com/watch?v=rdK92pf3abs
    this.tollService.tollAddEvents().subscribe(observer);
  }


  listenForCity() {
      let self = this;
      this.tollService.listenForCity().subscribe({
          next: function(value) {
	      self.query({city:value});
	  },
          error: function(value) {
          },
          complete: function() {}
      });
  }


  query(criteria) {
      this.tollService.getTolls(criteria)
    	  .subscribe(data => this.tolls = data);
  }


}
