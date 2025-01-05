import { TestBed } from '@angular/core/testing';

import { HatchingService } from './hatching.service';

describe('HatchingService', () => {
  let service: HatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
