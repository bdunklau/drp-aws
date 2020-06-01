import { TestBed } from '@angular/core/testing';
import { TollService } from './toll.service';
import { HttpClient  } from '@angular/common/http';

fdescribe('TollService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [TollService, {provide: HttpClient, useValue: {}}]
    }).compileComponents()
  );

  fit('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
