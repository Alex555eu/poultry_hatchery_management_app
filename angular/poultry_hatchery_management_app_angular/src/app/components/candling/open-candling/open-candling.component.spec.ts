import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCandlingComponent } from './open-candling.component';

describe('OpenCandlingComponent', () => {
  let component: OpenCandlingComponent;
  let fixture: ComponentFixture<OpenCandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenCandlingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenCandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
