import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnexpectedRejectionComponent } from './unexpected-rejection.component';

describe('UnexpectedRejectionComponent', () => {
  let component: UnexpectedRejectionComponent;
  let fixture: ComponentFixture<UnexpectedRejectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnexpectedRejectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnexpectedRejectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
