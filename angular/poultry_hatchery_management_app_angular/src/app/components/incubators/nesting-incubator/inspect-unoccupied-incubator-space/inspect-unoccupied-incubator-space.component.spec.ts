import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectUnoccupiedIncubatorSpaceComponent } from './inspect-unoccupied-incubator-space.component';

describe('InspectUnoccupiedIncubatorSpaceComponent', () => {
  let component: InspectUnoccupiedIncubatorSpaceComponent;
  let fixture: ComponentFixture<InspectUnoccupiedIncubatorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectUnoccupiedIncubatorSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectUnoccupiedIncubatorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
