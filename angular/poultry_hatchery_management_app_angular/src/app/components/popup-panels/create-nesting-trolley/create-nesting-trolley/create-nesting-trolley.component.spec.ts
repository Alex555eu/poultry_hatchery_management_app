import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNestingTrolleyComponent } from './create-nesting-trolley.component';

describe('CreateNestingTrolleyComponent', () => {
  let component: CreateNestingTrolleyComponent;
  let fixture: ComponentFixture<CreateNestingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNestingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNestingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
