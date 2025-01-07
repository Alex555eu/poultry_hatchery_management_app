import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectOccupiedIncubatorSpaceComponent } from './inspect-occupied-incubator-space.component';

describe('InspectOccupiedIncubatorSpaceComponent', () => {
  let component: InspectOccupiedIncubatorSpaceComponent;
  let fixture: ComponentFixture<InspectOccupiedIncubatorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectOccupiedIncubatorSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectOccupiedIncubatorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
