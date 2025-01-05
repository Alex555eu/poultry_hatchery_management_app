import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectHatchingTrolleyComponent } from './inspect-hatching-trolley.component';

describe('InspectHatchingTrolleyComponent', () => {
  let component: InspectHatchingTrolleyComponent;
  let fixture: ComponentFixture<InspectHatchingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectHatchingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectHatchingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
