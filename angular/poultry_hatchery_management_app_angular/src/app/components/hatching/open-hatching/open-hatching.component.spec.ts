import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHatchingComponent } from './open-hatching.component';

describe('OpenHatchingComponent', () => {
  let component: OpenHatchingComponent;
  let fixture: ComponentFixture<OpenHatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenHatchingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenHatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
