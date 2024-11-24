import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandlingComponent } from './candling.component';

describe('CandlingComponent', () => {
  let component: CandlingComponent;
  let fixture: ComponentFixture<CandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandlingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
