import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rejection1PanelComponent } from './rejection1-panel.component';

describe('Rejection1PanelComponent', () => {
  let component: Rejection1PanelComponent;
  let fixture: ComponentFixture<Rejection1PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rejection1PanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Rejection1PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
