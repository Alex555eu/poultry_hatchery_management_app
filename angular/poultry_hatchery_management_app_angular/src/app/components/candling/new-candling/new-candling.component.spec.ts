import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCandlingComponent } from './new-candling.component';

describe('NewCandlingComponent', () => {
  let component: NewCandlingComponent;
  let fixture: ComponentFixture<NewCandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCandlingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
