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

    private toll_add_subject = new Subject<Toll>();
    private city_selected = new Subject<string>();

    constructor(public http: HttpClient) { 
    }


    // called by TollComponent (toll.component.ts)  
    addToll(item: Toll) {

        // MAKING A POST REQUEST
	//      https://angular.io/guide/http#making-a-post-request

        return this.http.post('/drpapi/set-toll', item);
    }

    deleteToll(item: Toll) {
        return this.http.post('/drpapi/delete-tolls', item);
    }

    tollAdded(toll: {city: string, location: string, timea: number, timeb: number, price: number}) {
        this.toll_add_subject.next(toll);
    }

    tollAddEvents() {
        return this.toll_add_subject; 
    }


    getTolls(criteria): Observable<Toll[]> {

        let url:string = '/drpapi/get-tolls?';
        let keys = Object.keys(criteria);
        if(keys.length == 0)
            return Observable.of([]);

        let pairs = _.map(keys, key => {
            return key+'='+criteria[key];
        })
        let queryString = _.join(pairs, '&');
        url += queryString;
        console.log(`url = ${url}`);

	// ANGULAR HTTP
        //     https://angular.io/guide/http	
        var tolls = [];
        //return this.http.get('/drpapi/get-tolls?city=NYC').pipe(
        return this.http.get(url).pipe(
	    map(res => {
                _.each(res['result'], toll => {
		    tolls.push(new Toll(toll.city, toll.location, toll.price, toll.timea, toll.timeb))
		})	        
	        console.log('getTolls: ', tolls);
		return tolls;
	    })
	)
    }


    // TollComponent calls this and TollListComponent subscribes to city_selected
    // so that it knows what city to query on
    citySelected(city: string) {
        this.city_selected.next(city);
    }

    listenForCity() {
        return this.city_selected;
    }
}
