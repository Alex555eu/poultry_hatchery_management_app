import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHatchingIncubatorComponent } from './new-hatching-incubator.component';

describe('NewHatchingIncubatorComponent', () => {
  let component: NewHatchingIncubatorComponent;
  let fixture: ComponentFixture<NewHatchingIncubatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHatchingIncubatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewHatchingIncubatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
