import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { ChargeService } from './charge.service';

describe('ChargeService', () => {


    beforeEach(async () => {
       TestBed.configureTestingModule({
         declarations: [ ],
         imports: [
           HttpClientModule
         ],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
           HttpClient,
         ]
       })
         .compileComponents();
    });



  it('should be created', () => {
    const service: ChargeService = TestBed.get(ChargeService);
    expect(service).toBeTruthy();
  });
});
