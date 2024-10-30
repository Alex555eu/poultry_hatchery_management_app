import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHatchingIncubatorPanelComponent } from './create-hatching-incubator-panel.component';

describe('CreateHatchingIncubatorPanelComponent', () => {
  let component: CreateHatchingIncubatorPanelComponent;
  let fixture: ComponentFixture<CreateHatchingIncubatorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHatchingIncubatorPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHatchingIncubatorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
