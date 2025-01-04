import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNestingTrolleyToNestingComponent } from './add-nesting-trolley-to-nesting.component';

describe('AddNestingTrolleyToNestingComponent', () => {
  let component: AddNestingTrolleyToNestingComponent;
  let fixture: ComponentFixture<AddNestingTrolleyToNestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNestingTrolleyToNestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNestingTrolleyToNestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
