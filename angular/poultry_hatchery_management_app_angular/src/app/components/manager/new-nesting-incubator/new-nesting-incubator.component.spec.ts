import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNestingIncubatorComponent } from './new-nesting-incubator.component';

describe('NewNestingIncubatorComponent', () => {
  let component: NewNestingIncubatorComponent;
  let fixture: ComponentFixture<NewNestingIncubatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNestingIncubatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewNestingIncubatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
