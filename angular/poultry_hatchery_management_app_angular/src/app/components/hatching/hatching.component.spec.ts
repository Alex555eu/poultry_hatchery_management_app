import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatchingComponent } from './hatching.component';

describe('HatchingComponent', () => {
  let component: HatchingComponent;
  let fixture: ComponentFixture<HatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatchingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
