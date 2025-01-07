import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectUnoccupiedHatchingIncubatorSpaceComponent } from './inspect-unoccupied-hatching-incubator-space.component';

describe('InspectUnoccupiedHatchingIncubatorSpaceComponent', () => {
  let component: InspectUnoccupiedHatchingIncubatorSpaceComponent;
  let fixture: ComponentFixture<InspectUnoccupiedHatchingIncubatorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectUnoccupiedHatchingIncubatorSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectUnoccupiedHatchingIncubatorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
