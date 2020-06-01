import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { TollService } from './toll.service';

fdescribe('TollService', () => {





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










  fit('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
