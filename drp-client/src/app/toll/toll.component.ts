import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { LoadService } from '../load.service';
import { Toll } from './toll.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as _ from 'lodash';

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
              private loadService: LoadService,
	      private route: ActivatedRoute) {
    }

    ngOnInit() {
        console.log('TollComponent.noOnInit():  called');
	let self = this;
	
	// See  TollListComponent.onSelect() - that functions passes these parameters
	// as OPTIONAL parameters.   They aren't guaranteed to exist
	this.route.paramMap.subscribe((params: ParamMap) => {
	    let allPresent: boolean = params.get('city') && params.get('location') && params.get('price')
	        && params.get('timea') && params.get('timeb') ? true : false;
	    self.updating = allPresent;
            let city = params.get('city') ? params.get('city') : '';
	    let location = params.get('location') ? params.get('location') : '';
	    let timea = params.get('timea') ? parseInt(params.get('timea')) : 0;
	    let timeb = params.get('timeb') ? parseInt(params.get('timeb')) : 0;
            let price = params.get('price') ? parseInt(params.get('price')) : 0;
	    self.toll = new Toll(city, location, price, timea, timeb);
	});
    }

    onSubmit(form) {
	console.log('onSubmit: form = ', form);
        this.tollService.addToll(this.toll).subscribe(data => {
	    //console.log(data);
	    this.tollService.citySelected(this.toll.city);
	    this.tollService.tollAdded(data['args'])
	    this.newToll(form);
	})
    }

    newToll(form) {
	form.reset();
        this.updating = false;
        this.toll = new Toll('', '', 0, 0, 0) 
    }

    searchTolls(form) {
        this.tollService.citySelected(this.toll.city);
    }

    loadTolls(file:string) {
        let self = this;
        this.loadService.getTolls(file).subscribe(data => {
            self.loadService.loadTolls(data).subscribe(result => {
                //console.log('Is this a Toll[] :  ', result);

                // result is the json returned by drp-server/services/loadService.js:loadTolls()
                // Notable:  keys are status and result (so, yes result['result']
                // result['result'] contains: insertedIds (an array of _id values),
                // nInserted: int
                // nMatched: int
                // nModified: int
                // nRemoved: int
                // nUpserted: int
                // ok: int   and a few others
                self.tollService.tollsAdded(data);
            })
        });
    }

}
