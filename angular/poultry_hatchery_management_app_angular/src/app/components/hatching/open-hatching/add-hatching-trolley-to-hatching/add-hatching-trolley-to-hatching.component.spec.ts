import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHatchingTrolleyToHatchingComponent } from './add-hatching-trolley-to-hatching.component';

describe('AddHatchingTrolleyToHatchingComponent', () => {
  let component: AddHatchingTrolleyToHatchingComponent;
  let fixture: ComponentFixture<AddHatchingTrolleyToHatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHatchingTrolleyToHatchingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHatchingTrolleyToHatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
