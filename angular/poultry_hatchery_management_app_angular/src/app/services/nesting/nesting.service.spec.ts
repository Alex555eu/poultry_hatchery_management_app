import { TestBed } from '@angular/core/testing';

import { NestingService } from './nesting.service';

describe('NestingService', () => {
  let service: NestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
