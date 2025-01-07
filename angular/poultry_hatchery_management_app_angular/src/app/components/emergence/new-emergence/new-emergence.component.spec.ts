import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmergenceComponent } from './new-emergence.component';

describe('NewEmergenceComponent', () => {
  let component: NewEmergenceComponent;
  let fixture: ComponentFixture<NewEmergenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEmergenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEmergenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
