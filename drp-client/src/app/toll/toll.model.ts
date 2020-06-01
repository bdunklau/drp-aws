
//  ng generate class toll/toll --type=model
export class Toll {

    constructor(public city: string,
	        public location: string,
	        public price: number,
	        public timea: number,
	        public timeb: number) {
    }

}
