import { Component, OnInit } from '@angular/core';
import { TollService } from '../toll.service';
import { Toll } from './toll.model';

@Component({
  selector: 'app-toll',
  templateUrl: './toll.component.html',
  styleUrls: ['./toll.component.css']
})
export class TollComponent implements OnInit {

    toll = new Toll('', '', 0, 0, 0);
    // private tollForm;

    constructor(private tollService: TollService,
	      ) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.tollService.addToll(this.toll).subscribe(data => {console.log(data);})
    }

}
