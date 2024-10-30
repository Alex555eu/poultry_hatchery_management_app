import { TestBed } from '@angular/core/testing';

import { NestingIncubatorService } from './nesting-incubator.service';

describe('NestingIncubatorServiceService', () => {
  let service: NestingIncubatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestingIncubatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
