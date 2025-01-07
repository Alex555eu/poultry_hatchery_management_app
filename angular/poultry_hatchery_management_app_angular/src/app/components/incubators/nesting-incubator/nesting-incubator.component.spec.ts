import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestingIncubatorComponent } from './nesting-incubator.component';

describe('NestingIncubatorComponent', () => {
  let component: NestingIncubatorComponent;
  let fixture: ComponentFixture<NestingIncubatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestingIncubatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NestingIncubatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
