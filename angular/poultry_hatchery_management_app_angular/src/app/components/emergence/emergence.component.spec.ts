import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergenceComponent } from './emergence.component';

describe('EmergenceComponent', () => {
  let component: EmergenceComponent;
  let fixture: ComponentFixture<EmergenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
