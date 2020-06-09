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
export class LoadService {

    private tolls_added = new Subject<Toll[]>();

    constructor(public http: HttpClient) { 
    }

    getTolls(asset_file:string): Observable<Toll[]> {
        let tolls = [];
        return this.http.get(`./assets/${asset_file}`).pipe(
            map(res => {
                _.each(res, toll => {
                    tolls.push(new Toll(toll.city, toll.location, toll.price, toll.timea, toll.timeb));
                })
                return tolls;
            })
        );
    }


    // called by TollComponent (toll.component.ts)  
    loadTolls(tolls: Toll[]) {
        // MAKING A POST REQUEST
       	// https://angular.io/guide/http#making-a-post-request

        return this.http.post('/drpapi/temp-load-tolls', {tolls: tolls});
    }


}
