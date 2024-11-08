import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSupplierComponent } from './find-supplier.component';

describe('FindSupplierComponent', () => {
  let component: FindSupplierComponent;
  let fixture: ComponentFixture<FindSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
