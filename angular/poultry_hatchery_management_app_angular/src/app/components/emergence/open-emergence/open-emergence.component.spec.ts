import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEmergenceComponent } from './open-emergence.component';

describe('OpenEmergenceComponent', () => {
  let component: OpenEmergenceComponent;
  let fixture: ComponentFixture<OpenEmergenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenEmergenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenEmergenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
