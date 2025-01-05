import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rejection3PanelComponent } from './rejection3-panel.component';

describe('Rejection3PanelComponent', () => {
  let component: Rejection3PanelComponent;
  let fixture: ComponentFixture<Rejection3PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rejection3PanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Rejection3PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
