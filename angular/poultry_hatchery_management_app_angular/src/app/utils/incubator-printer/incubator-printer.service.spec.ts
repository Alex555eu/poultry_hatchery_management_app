import { TestBed } from '@angular/core/testing';

import { IncubatorPrinterService } from './incubator-printer.service';

describe('IncubatorPrinterService', () => {
  let service: IncubatorPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncubatorPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
