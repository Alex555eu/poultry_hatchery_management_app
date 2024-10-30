import { TestBed } from '@angular/core/testing';

import { HatchingTrolleyService } from './hatching-trolley.service';

describe('HatchingTrolleyService', () => {
  let service: HatchingTrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatchingTrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
