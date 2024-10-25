import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyNestingIncubatorPanelComponent } from './modify-nesting-incubator-panel.component';

describe('ModifyNestingIncubatorPanelComponent', () => {
  let component: ModifyNestingIncubatorPanelComponent;
  let fixture: ComponentFixture<ModifyNestingIncubatorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyNestingIncubatorPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyNestingIncubatorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
