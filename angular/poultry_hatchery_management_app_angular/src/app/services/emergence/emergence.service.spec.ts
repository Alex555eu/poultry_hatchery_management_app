import { TestBed } from '@angular/core/testing';

import { EmergenceService } from './emergence.service';

describe('EmergenceService', () => {
  let service: EmergenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
