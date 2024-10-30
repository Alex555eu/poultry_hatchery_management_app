import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHatchingTrolleyComponent } from './create-hatching-trolley.component';

describe('CreateHatchingTrolleyComponent', () => {
  let component: CreateHatchingTrolleyComponent;
  let fixture: ComponentFixture<CreateHatchingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHatchingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHatchingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
