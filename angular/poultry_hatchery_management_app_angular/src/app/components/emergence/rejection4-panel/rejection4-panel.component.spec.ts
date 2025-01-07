import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rejection4PanelComponent } from './rejection4-panel.component';

describe('Rejection4PanelComponent', () => {
  let component: Rejection4PanelComponent;
  let fixture: ComponentFixture<Rejection4PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rejection4PanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Rejection4PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
