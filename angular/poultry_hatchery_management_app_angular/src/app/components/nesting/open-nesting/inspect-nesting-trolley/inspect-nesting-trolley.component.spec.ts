import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectNestingTrolleyComponent } from './inspect-nesting-trolley.component';

describe('InspectNestingTrolleyComponent', () => {
  let component: InspectNestingTrolleyComponent;
  let fixture: ComponentFixture<InspectNestingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectNestingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectNestingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
