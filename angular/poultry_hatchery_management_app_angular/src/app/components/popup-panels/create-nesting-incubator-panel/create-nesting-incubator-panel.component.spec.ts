import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNestingIncubatorPanelComponent } from './create-nesting-incubator-panel.component';

describe('CreateNestingIncubatorPanelComponent', () => {
  let component: CreateNestingIncubatorPanelComponent;
  let fixture: ComponentFixture<CreateNestingIncubatorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNestingIncubatorPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNestingIncubatorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
