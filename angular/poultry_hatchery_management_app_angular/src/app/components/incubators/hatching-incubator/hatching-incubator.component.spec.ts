import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatchingIncubatorComponent } from './hatching-incubator.component';

describe('HatchingIncubatorComponent', () => {
  let component: HatchingIncubatorComponent;
  let fixture: ComponentFixture<HatchingIncubatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatchingIncubatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HatchingIncubatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
