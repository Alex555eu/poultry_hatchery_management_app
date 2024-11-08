import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNestingTrolleyComponent } from './new-nesting-trolley.component';

describe('NewNestingTrolleyComponent', () => {
  let component: NewNestingTrolleyComponent;
  let fixture: ComponentFixture<NewNestingTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNestingTrolleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewNestingTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
