import { TestBed } from '@angular/core/testing';

import { NestingLoadedDeliveriesService } from './nesting-loaded-deliveries.service';

describe('NestingLoadedDeliveriesService', () => {
  let service: NestingLoadedDeliveriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestingLoadedDeliveriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
