import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNestingComponent } from './new-nesting.component';

describe('NewNestingComponent', () => {
  let component: NewNestingComponent;
  let fixture: ComponentFixture<NewNestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewNestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
