import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectTemporarilyUnoccupiedIncubatorSpaceComponent } from './inspect-temporarily-unoccupied-incubator-space.component';

describe('InspectTemporarilyUnoccupiedIncubatorSpaceComponent', () => {
  let component: InspectTemporarilyUnoccupiedIncubatorSpaceComponent;
  let fixture: ComponentFixture<InspectTemporarilyUnoccupiedIncubatorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectTemporarilyUnoccupiedIncubatorSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectTemporarilyUnoccupiedIncubatorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
