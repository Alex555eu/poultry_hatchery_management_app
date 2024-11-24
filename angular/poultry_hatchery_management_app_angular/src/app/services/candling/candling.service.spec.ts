import { TestBed } from '@angular/core/testing';

import { CandlingService } from './candling.service';

describe('CandlingService', () => {
  let service: CandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
