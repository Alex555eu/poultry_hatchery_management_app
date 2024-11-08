import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHatchingTrolleyComponent } from './new-hatching-trolley.component';

describe('NewHatchingTrolleyComponent', () => {
  let component: NewHatchingTrolleyComponent;
  let fixture: ComponentFixture<NewHatchingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHatchingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewHatchingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
