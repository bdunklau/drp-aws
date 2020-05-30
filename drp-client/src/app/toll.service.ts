import { Injectable } from '@angular/core';
import { Toll } from './toll/toll.model';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TollService {

    public tolls: Toll[];
    public add_subject = new Subject<Toll>();

    constructor(private http: Http) { 
        this.tolls = [];
    }

    addToll(item: Toll) {
        return this.http.post('/drpapi/set-toll', item);
    } 

    getTolls(city: string) {
        return this.http.get(`/drpapi/get-tolls/${city}`);
    }
}
