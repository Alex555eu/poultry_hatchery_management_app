import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectOccupiedHatchingIncubatorSpaceComponent } from './inspect-occupied-hatching-incubator-space.component';

describe('InspectOccupiedHatchingIncubatorSpaceComponent', () => {
  let component: InspectOccupiedHatchingIncubatorSpaceComponent;
  let fixture: ComponentFixture<InspectOccupiedHatchingIncubatorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectOccupiedHatchingIncubatorSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectOccupiedHatchingIncubatorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
