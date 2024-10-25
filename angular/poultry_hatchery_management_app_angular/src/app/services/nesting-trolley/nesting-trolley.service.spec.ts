import { TestBed } from '@angular/core/testing';

import { NestingTrolleyService } from './nesting-trolley.service';

describe('NestingTrolleyService', () => {
  let service: NestingTrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestingTrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
