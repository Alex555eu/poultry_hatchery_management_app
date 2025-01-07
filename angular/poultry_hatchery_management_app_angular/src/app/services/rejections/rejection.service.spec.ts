import { TestBed } from '@angular/core/testing';

import { RejectionService } from './rejection.service';

describe('RejectionService', () => {
  let service: RejectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
