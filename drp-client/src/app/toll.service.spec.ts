import { TestBed } from '@angular/core/testing';
import { TollService } from './toll.service';
import { HttpClient  } from '@angular/common/http';
import { MockBackend, MockConnection } from '@angular/common/http/testing';
import {
  Http, HttpModule, XHRBackend, ResponseOptions,
  Response, BaseRequestOptions
} from '@angular/http';


fdescribe('TollService', () => {
  beforeEach(() => TestBed.configureTestingModule({


         providers: [
		{
		  provide: Http, useFactory: (backend, options) => {
			return new Http(backend, options);
		  },
		  deps: [MockBackend, BaseRequestOptions]
		},
		MockBackend,
		BaseRequestOptions,
		TollService
	  ]







    }).compileComponents()
  );

  fit('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
