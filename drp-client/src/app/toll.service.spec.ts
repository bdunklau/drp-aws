import { TestBed } from '@angular/core/testing';
import { TollService } from './toll.service';
import { HttpClient } from '@angular/common/http';

describe('TollService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: HttpClient, useValue: {}}]
  }));

  it('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
