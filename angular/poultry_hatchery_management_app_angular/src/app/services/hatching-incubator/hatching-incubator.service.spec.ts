import { TestBed } from '@angular/core/testing';

import { HatchingIncubatorService } from './hatching-incubator.service';

describe('HatchingIncubatorService', () => {
  let service: HatchingIncubatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatchingIncubatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
