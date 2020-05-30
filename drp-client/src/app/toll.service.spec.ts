import { TestBed } from '@angular/core/testing';

import { TollService } from './toll.service';

describe('TollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TollService = TestBed.get(TollService);
    expect(service).toBeTruthy();
  });
});
