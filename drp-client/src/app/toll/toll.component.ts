import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { Toll } from './toll.model';
//import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toll',
  templateUrl: './toll.component.html',
  styleUrls: ['./toll.component.css']
})
export class TollComponent implements OnInit {

    toll = new Toll('', '', 0, 0, 0);
    // private tollForm;
    updating:boolean = false;

    constructor(private tollService: TollService,
	      /*private route: ActivatedRoute*/) {
    }

    ngOnInit() {
        console.log('TollComponent.noOnInit():  called');
	let self = this;
	this.tollService.tollSelectEvents().subscribe({
	    next: function(value) {
		self.updating = true;
	        self.toll = new Toll(value.city, value.location, value.price, value.timea, value.timeb)
	    },
	    error: function(value) {},
	    complete: function() {}
	});
	/**********
	let city = this.route.snapshot.paramMap.get('city');
	let location = this.route.snapshot.paramMap.get('location');
	let timea = parseInt(this.route.snapshot.paramMap.get('timea'));
	let timeb = parseInt(this.route.snapshot.paramMap.get('timeb'));
	if(city) this.toll.city = city;
	if(location) this.toll.location = location;
	if(timea) this.toll.timea = timea;
	if(timeb) this.toll.timeb = timeb;
	console.log('city:', city, ' location:',location, ' timea:', timea, ' timeb:', timeb);
          *********/
    }

    onSubmit(form) {
	console.log('onSubmit: form = ', form);
        this.tollService.addToll(this.toll).subscribe(data => {
	    //console.log(data);
	    this.tollService.tollAdded(data['args'])
	    this.newToll(form);
	})
    }

    newToll(form) {
	form.reset();
        this.updating = false;
        this.toll = new Toll('', '', 0, 0, 0) 
    }

}
