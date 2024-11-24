import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionPanelTotalComponent } from './rejection-panel-total.component';

describe('RejectionPanelTotalComponent', () => {
  let component: RejectionPanelTotalComponent;
  let fixture: ComponentFixture<RejectionPanelTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionPanelTotalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectionPanelTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
