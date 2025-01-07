import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTaskedTrolleysComponent } from './find-tasked-trolleys.component';

describe('FindTaskedTrolleysComponent', () => {
  let component: FindTaskedTrolleysComponent;
  let fixture: ComponentFixture<FindTaskedTrolleysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTaskedTrolleysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindTaskedTrolleysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
