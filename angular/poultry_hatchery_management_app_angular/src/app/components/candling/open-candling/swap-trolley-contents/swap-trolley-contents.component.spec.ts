import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapTrolleyContentsComponent } from './swap-trolley-contents.component';

describe('SwapTrolleyContentsComponent', () => {
  let component: SwapTrolleyContentsComponent;
  let fixture: ComponentFixture<SwapTrolleyContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapTrolleyContentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwapTrolleyContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
