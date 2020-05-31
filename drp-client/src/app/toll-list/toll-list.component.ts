import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { Toll } from '../toll/toll.model';

@Component({
  selector: 'app-toll-list',
  templateUrl: './toll-list.component.html',
  styleUrls: ['./toll-list.component.css']
})
export class TollListComponent implements OnInit {

  city: string = 'CityA';
  public tolls = []

  constructor(private tollService:TollService) { }

  ngOnInit() {
    this.tollService.getTolls(this.city)
    	.subscribe(data => this.tolls = data);

    let self = this;
    var observer = 
	    {
        next: function(value) {
            self.tolls.push(value);
	},
	error: function(value) {
	},
	complete: function() {}
    }

    //see   2:35 of https://www.youtube.com/watch?v=rdK92pf3abs
    this.tollService.tollAddEvents().subscribe(observer);
  }


}
