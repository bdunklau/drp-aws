import { Injectable } from '@angular/core';
import { Toll } from './toll/toll.model';
import { Subject } from 'rxjs/Subject';
//import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
//import { HttpClientModule }    from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class TollService {

    //public tolls: Toll[];
    private toll_add_subject = new Subject<Toll>();
    //private toll_selected = new Subject<Toll>();

    constructor(public http: HttpClient) { 
        //this.tolls = [];
    }


    // called by TollComponent (toll.component.ts)  
    addToll(item: Toll) {

        // MAKING A POST REQUEST
	//      https://angular.io/guide/http#making-a-post-request

        return this.http.post('/drpapi/set-toll', item);
    }

    tollAdded(toll: {city: string, location: string, timea: number, timeb: number, price: number}) {
        this.toll_add_subject.next(toll);
    }

    tollAddEvents() {
        return this.toll_add_subject; 
    }

    /******
    tollSelectEvents() {
        return this.toll_selected;
    }

    tollSelected(toll) {
        this.toll_selected.next(toll);
    } 
     *****/

    getTolls(city: string): Observable<Toll[]> {

	// ANGULAR HTTP
        //     https://angular.io/guide/http	
        var tolls = [];
        return this.http.get(`/drpapi/get-tolls/${city}`).pipe(
	    map(res => {
                _.each(res['result'], toll => {
		    tolls.push(new Toll(toll.city, toll.location, toll.price, toll.timea, toll.timeb))
		})	        
	        console.log('getTolls: ', tolls);
		return tolls;
	    })
	)
    }
}
