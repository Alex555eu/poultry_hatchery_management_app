import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryToNestingComponent } from './add-delivery-to-nesting.component';

describe('AddDeliveryToNestingComponent', () => {
  let component: AddDeliveryToNestingComponent;
  let fixture: ComponentFixture<AddDeliveryToNestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeliveryToNestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDeliveryToNestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
