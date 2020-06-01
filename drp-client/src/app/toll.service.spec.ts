import { TestBed } from '@angular/core/testing';
import { TollService } from './toll.service';
import { HttpClient, HttpClientTestingModule  } from '@angular/common/http';

fdescribe('TollService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: HttpClient, useValue: {}}],
    imports: [ HttpClientTestingModule ]
  }));

  fit('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
