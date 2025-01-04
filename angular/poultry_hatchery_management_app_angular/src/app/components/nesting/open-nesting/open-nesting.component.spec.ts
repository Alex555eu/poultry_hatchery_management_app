import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNestingComponent } from './open-nesting.component';

describe('OpenNestingComponent', () => {
  let component: OpenNestingComponent;
  let fixture: ComponentFixture<OpenNestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenNestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenNestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
