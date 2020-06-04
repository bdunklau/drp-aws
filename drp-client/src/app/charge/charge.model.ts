import * as moment from 'moment-timezone';


//  ng generate class charge --type=model
export class Charge {


    constructor(public plate: string,
	       public city: string,
	       public location: string,
	       public time:number) {
    }

    setTime(year:number, month:number, day:number, hour:number, minute:number, second:number) {
        this.time = moment().set('year', year).set('month', month-1)
            .set('date', day).set('hour', hour)
            .set('minute', minute).set('second', second).valueOf();
	       
    }

}
