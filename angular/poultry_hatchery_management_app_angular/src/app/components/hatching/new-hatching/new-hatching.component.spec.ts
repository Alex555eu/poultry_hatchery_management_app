import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHatchingComponent } from './new-hatching.component';

describe('NewHatchingComponent', () => {
  let component: NewHatchingComponent;
  let fixture: ComponentFixture<NewHatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHatchingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewHatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
