import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionPanelComponent } from './rejection-panel.component';

describe('RejectionPanelComponent', () => {
  let component: RejectionPanelComponent;
  let fixture: ComponentFixture<RejectionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
