import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { Toll } from '../toll/toll.model';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-toll-list',
  templateUrl: './toll-list.component.html',
  styleUrls: ['./toll-list.component.css']
})
export class TollListComponent implements OnInit {

  city: string;
  public tolls = [];

  constructor(private tollService:TollService,
	     private router: Router,
	     private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this;
    this.route.paramMap.subscribe((params: ParamMap) => {
	if(!params.get('city'))
            return;
        self.city = params.get('city');
        this.tollService.getTolls(self.city)
    	  .subscribe(data => this.tolls = data);
    
    }) 

    this.listenForTollsToBeAdded();
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

}
